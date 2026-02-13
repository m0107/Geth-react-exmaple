#!/usr/bin/env node

/**
 * Decrypt wallet from JSON backup and check balance on-chain
 *
 * Usage:
 *   node scripts/check-wallet-balance.js <wallet-file> [pin]
 *
 * Examples:
 *   node scripts/check-wallet-balance.js 123456789012.json 123456
 */

const fs = require("fs");
const crypto = require("crypto");
const { keccak256 } = require("js-sha3");

const RPC_URL = process.env.REACT_APP_RPC_URL || "http://35.244.50.57:8545";

// ── RPC helper ──────────────────────────────────────────────────────────────
async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

function weiToEth(weiHex) {
  const wei = BigInt(weiHex);
  const whole = wei / BigInt(1e18);
  const fraction = wei % BigInt(1e18);
  return `${whole}.${fraction.toString().padStart(18, "0")}`;
}

// ── Decrypt using the same scheme as the SDK ────────────────────────────────
// Encrypted blob = base64( salt[16] | iv[12] | ciphertext )
// Key derivation  = PBKDF2(pin, salt, 100000, SHA-256) → AES-256-GCM
async function decryptWithPin(base64Blob, pin) {
  const buf = Buffer.from(base64Blob, "base64");
  const salt = buf.slice(0, 16);
  const iv = buf.slice(16, 28);
  const ciphertext = buf.slice(28);

  // AES-GCM auth tag is the last 16 bytes of the ciphertext
  const authTag = ciphertext.slice(ciphertext.length - 16);
  const encrypted = ciphertext.slice(0, ciphertext.length - 16);

  const key = crypto.pbkdf2Sync(pin, salt, 100000, 32, "sha256");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

// ── Derive Ethereum address from a hex private key ──────────────────────────
function privateKeyToAddress(privKeyHex) {
  const key = privKeyHex.startsWith("0x") ? privKeyHex.slice(2) : privKeyHex;
  const { createPublicKey, createHash } = crypto;

  // Import as an EC private key (secp256k1)
  const privBuf = Buffer.from(key, "hex");
  const ecKey = crypto.createPrivateKey({
    key: Buffer.concat([
      // DER prefix for secp256k1 private key (32 bytes)
      Buffer.from("30740201010420", "hex"),
      privBuf,
      Buffer.from("a00706052b8104000aa14403420004", "hex"),
      getUncompressedPublicKey(privBuf),
    ]),
    format: "der",
    type: "sec1",
  });

  const pubKey = crypto.createPublicKey(ecKey);
  const pubDer = pubKey.export({ type: "spki", format: "der" });
  // Uncompressed public key bytes (skip DER header) → last 64 bytes
  const pubRaw = pubDer.slice(-64);
  const hash = crypto.createHash("sha3-256").update(pubRaw).digest();
  return "0x" + hash.slice(-20).toString("hex");
}

function getUncompressedPublicKey(privBuf) {
  // Use ECDH to derive public key from private key
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privBuf);
  // Return without the 04 prefix (64 bytes)
  return ecdh.getPublicKey().slice(1);
}

// Simpler approach: use ECDH directly + Ethereum keccak256 for address
function privKeyToAddr(privKeyHex) {
  const key = privKeyHex.startsWith("0x") ? privKeyHex.slice(2) : privKeyHex;
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(Buffer.from(key, "hex"));
  // Uncompressed public key without 0x04 prefix
  const pubKey = ecdh.getPublicKey().slice(1); // remove 04 prefix
  // Ethereum uses Keccak-256 (NOT NIST SHA3-256)
  const hash = Buffer.from(keccak256.arrayBuffer(pubKey));
  return "0x" + hash.slice(-20).toString("hex");
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const walletFile = process.argv[2];
  const pin = process.argv[3] || "123456";

  if (!walletFile) {
    console.error("Usage: node scripts/check-wallet-balance.js <wallet-file.json> [pin]");
    process.exit(1);
  }

  const filePath = require("path").resolve(walletFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const walletData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const hashes = Object.keys(walletData);

  console.log(`\n🔗 RPC: ${RPC_URL}`);
  console.log(`📁 Wallet file: ${filePath}`);
  console.log(`🔑 PIN: ${"*".repeat(pin.length)}`);
  console.log(`📦 Found ${hashes.length} wallet(s)\n`);

  for (const hash of hashes) {
    console.log(`  ─── Wallet hash: ${hash} ───`);
    try {
      const privateKey = await decryptWithPin(walletData[hash], pin);
      const address = privKeyToAddr(privateKey);

      const balanceHex = await rpc("eth_getBalance", [address, "latest"]);
      const wei = BigInt(balanceHex);
      const eth = weiToEth(balanceHex);

      console.log(`  🔓 Decrypted successfully`);
      console.log(`  📍 Address : ${address}`);
      console.log(`  💰 Balance : ${eth} ETH`);
      console.log(`               ${wei.toString()} wei`);

      if (wei < BigInt(500_000) * BigInt(20e9)) {
        console.log(`\n  ⚠️  LOW BALANCE — transactions will fail!`);
        console.log(`  💡 Fund it with:`);
        console.log(`     curl -X POST http://35.244.50.57:3002/faucet \\`);
        console.log(`       -H "Content-Type: application/json" \\`);
        console.log(`       -d '{"address":"${address}","amount":"1.0"}'`);
      } else {
        console.log(`  ✅ Balance is sufficient for transactions`);
      }
    } catch (e) {
      console.log(`  ❌ Decryption failed: ${e.message}`);
      if (e.message.includes("Unsupported state") || e.message.includes("unable to authenticate")) {
        console.log(`     → Wrong PIN? Try a different PIN.`);
      }
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
