const { transactions } = require("../models/mockData.js");

function getBalances(_req, res) {
  return res.json({
    total: 1234567,
    available: 1200000,
    reserved: 45230,
    gasFees: 1234,
    tokens: [
      { symbol: "USDC", chain: "BNB", balance: 125000, value: 125000 },
      { symbol: "BNB", chain: "BNB", balance: 45.5, value: 27300 },
      { symbol: "USDC", chain: "ETH", balance: 25000, value: 25000 },
      { symbol: "ETH", chain: "ETH", balance: 8.2, value: 24600 },
      { symbol: "USDC", chain: "SOL", balance: 15000, value: 15000 },
      { symbol: "USDC", chain: "BASE", balance: 8000, value: 8000 },
    ],
  });
}

function getTreasuryTransactions(_req, res) {
  return res.json({ items: transactions });
}

function getBridgeOverview(_req, res) {
  return res.json({
    amount: 50000,
    history: [
      { id: "b1", label: "USDC → ETH", detail: "Queued • 2 mins ago", status: "queued" },
      { id: "b2", label: "BNB → SOL", detail: "Completed • 4 hours ago", status: "completed" },
      { id: "b3", label: "ETH → BASE", detail: "Pending review", status: "review" },
    ],
  });
}

function deposit(req, res) {
  return res.json({ ok: true, address: "0x7f3eA4b21cD9f08B5a6c11E0B23F8a9D4cE7b210", ...req.body });
}

function withdraw(req, res) {
  return res.json({ ok: true, txId: "0x" + Math.random().toString(16).slice(2, 10), ...req.body });
}

function bridge(req, res) {
  return res.json({ ok: true, txId: "0x" + Math.random().toString(16).slice(2, 10), ...req.body });
}

function getLiquidityPools(_req, res) {
  return res.json({ items: [{ name: "USDC/BNB", tvl: 620000, apr: 14.2 }, { name: "ETH/SOL", tvl: 410000, apr: 9.7 }] });
}

function getTreasurySummary(_req, res) {
  return res.json({ totalValue: 1234567, availableValue: 1200000, reservedValue: 45230, pendingTransfers: 3 });
}

function getBridgeHistory(_req, res) {
  return res.json({ items: [{ id: "bh1", from: "BNB", to: "SOL", amount: 12000, status: "completed" }] });
}

function estimateBridgeFee(req, res) {
  const amount = Number(req.body?.amount ?? 0);
  return res.json({ amount, estimatedFee: amount * 0.01, chain: req.body?.chain ?? "BNB" });
}

function getTreasuryAlerts(_req, res) {
  return res.json({ items: [{ id: "ta1", message: "Reserve threshold reached", severity: "warning" }] });
}

function getTreasuryReports(_req, res) {
  return res.json({ items: [{ id: "tr1", name: "Monthly reserve report", generatedAt: "2024-05-01" }] });
}

function health(_req, res) {
  return res.json({ ok: true, service: "treasury" });
}

module.exports = {
  getBalances,
  getTreasuryTransactions,
  getBridgeOverview,
  deposit,
  withdraw,
  bridge,
  getLiquidityPools,
  getTreasurySummary,
  getBridgeHistory,
  estimateBridgeFee,
  getTreasuryAlerts,
  getTreasuryReports,
  health,
};
