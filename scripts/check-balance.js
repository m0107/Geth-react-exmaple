#!/usr/bin/env node

/**
 * Check ETH balance for all accounts on the Geth node
 * Usage:
 *   node scripts/check-balance.js                   # lists all node accounts + balances
 *   node scripts/check-balance.js <address>          # checks a specific address
 */

const RPC_URL = process.env.REACT_APP_RPC_URL || "http://35.244.50.57:8545";

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

async function getBalance(address) {
  const balanceHex = await rpc("eth_getBalance", [address, "latest"]);
  const wei = BigInt(balanceHex);
  return { address, wei, eth: weiToEth(balanceHex) };
}

async function main() {
  const specificAddress = process.argv[2];

  console.log(`\n🔗 RPC: ${RPC_URL}\n`);

  if (specificAddress) {
    // Check a single address
    const { address, wei, eth } = await getBalance(specificAddress);
    console.log(`  Address : ${address}`);
    console.log(`  Balance : ${eth} ETH`);
    console.log(`            ${wei.toString()} wei\n`);

    if (wei < BigInt(500_000) * BigInt(20e9)) {
      console.log("  ⚠️  Balance is low — may not be enough for transactions.");
      console.log("  💡 Fund it:  curl -X POST http://35.244.50.57:3002/faucet \\");
      console.log(`       -H "Content-Type: application/json" \\`);
      console.log(`       -d '{"address":"${address}","amount":"1.0"}'\n`);
    }
    return;
  }

  // List all node accounts
  const accounts = await rpc("eth_accounts");

  if (!accounts || accounts.length === 0) {
    console.log("  No accounts found on the node.\n");
    return;
  }

  console.log(`  Found ${accounts.length} account(s):\n`);
  console.log("  " + "-".repeat(72));
  console.log(`  ${"#".padEnd(4)} ${"Address".padEnd(44)} ${"Balance (ETH)".padStart(24)}`);
  console.log("  " + "-".repeat(72));

  for (let i = 0; i < accounts.length; i++) {
    const { address, eth } = await getBalance(accounts[i]);
    console.log(`  ${String(i + 1).padEnd(4)} ${address.padEnd(44)} ${eth.padStart(24)}`);
  }

  console.log("  " + "-".repeat(72));
  console.log();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
