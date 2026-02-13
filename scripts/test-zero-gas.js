#!/usr/bin/env node

/**
 * Test zero-gas-price transaction on the private Geth chain
 */

const RPC_URL = "http://35.244.50.57:8545";

async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return (await res.json());
}

async function main() {
  // Send a zero-gas-price transaction from the unlocked node account
  console.log("Sending zero-gas-price transaction...\n");

  const txResult = await rpc("eth_sendTransaction", [{
    from: "0x1A85Da36C95597dFb8a9DE173F62CE80d245C1d8",
    to: "0x1567862A27960De7433F037c7F3435ee13e81d35",
    value: "0x1",
    gasPrice: "0x0",
  }]);

  if (txResult.error) {
    console.log("❌ Transaction rejected:", txResult.error.message);
    return;
  }

  const txHash = txResult.result;
  console.log("TX hash:", txHash);

  // Wait for mining
  await new Promise((r) => setTimeout(r, 2000));

  const receiptResult = await rpc("eth_getTransactionReceipt", [txHash]);
  const receipt = receiptResult.result;

  if (!receipt) {
    console.log("⏳ Not mined yet, waiting longer...");
    await new Promise((r) => setTimeout(r, 3000));
    const r2 = await rpc("eth_getTransactionReceipt", [txHash]);
    if (!r2.result) {
      console.log("❌ Still not mined after 5s");
      return;
    }
  }

  const r = receipt || (await rpc("eth_getTransactionReceipt", [txHash])).result;
  console.log("Status:", r.status === "0x1" ? "✅ SUCCESS" : "❌ FAILED");
  console.log("Gas used:", parseInt(r.gasUsed, 16));
  console.log("Effective gas price:", parseInt(r.effectiveGasPrice || "0x0", 16), "wei");
  console.log("\n✅ Zero-gas transactions WORK on this chain!");
}

main().catch((e) => console.error("Error:", e.message));
