const { scheduled, transactions } = require("../models/mockData.js");

function getStats(_req, res) {
  return res.json({
    totalPayroll: 1234567.89,
    payrollChange: 12.5,
    activeEmployees: 147,
    activeBreakdown: { active: 128, pending: 12, inactive: 7 },
    crossChainTransactions: 342,
    chainDistribution: { BNB: 65, ETH: 20, SOL: 10, BASE: 5 },
    privacyScore: 96,
    privacySubscores: { zk: 95, fhe: 92, compliance: 96 },
  });
}

function getTransactions(_req, res) {
  return res.json({ items: transactions });
}

function getPayrollActivity(req, res) {
  const range = String(req.query.range ?? "monthly");
  const points = range === "weekly" ? 7 : range === "yearly" ? 12 : 30;
  const labels = range === "yearly"
    ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : Array.from({ length: points }, (_, i) => `${range === "weekly" ? "Day" : "D"}${i + 1}`);

  const series = labels.map((label, i) => ({
    label,
    BNB: Math.round(20000 + Math.sin(i / 2) * 9000 + Math.random() * 5000),
    ETH: Math.round(8000 + Math.cos(i / 2) * 4000 + Math.random() * 3000),
    SOL: Math.round(4000 + Math.sin(i / 3) * 2000 + Math.random() * 1500),
    BASE: Math.round(1800 + Math.random() * 1200),
  }));

  return res.json({ series });
}

function getUpcomingPayrolls(_req, res) {
  return res.json({ items: scheduled });
}

function getRecentActivity(_req, res) {
  return res.json({ items: transactions.slice(0, 5) });
}

function getExpenseBreakdown(_req, res) {
  return res.json({
    items: [
      { category: "Payroll", amount: 740000, percentage: 62 },
      { category: "Compliance", amount: 124000, percentage: 10 },
      { category: "Infrastructure", amount: 98000, percentage: 8 },
      { category: "Operations", amount: 76000, percentage: 6 },
      { category: "Other", amount: 92000, percentage: 7 },
    ],
  });
}

function getPerformanceSummary(_req, res) {
  return res.json({
    throughput: 98.2,
    latency: 182,
    successRate: 99.4,
    healthyServices: 14,
    alerts: 2,
  });
}

function getComplianceSnapshot(_req, res) {
  return res.json({ score: 96, openIssues: 2, documentCount: 24, nextAudit: "2026-09-01" });
}

function getRiskSignals(_req, res) {
  return res.json({ items: [{ id: "r1", title: "High-volume payout", severity: "medium" }, { id: "r2", title: "Pending KYC", severity: "low" }] });
}

function getDashboardAlerts(_req, res) {
  return res.json({ items: [{ id: "al1", message: "Payroll batch is scheduled for tomorrow", level: "info" }] });
}

function getForecast(_req, res) {
  return res.json({ projectedSpend: 1420000, projectedPayroll: 1180000, confidence: 0.91 });
}

function health(_req, res) {
  return res.json({ ok: true, service: "dashboard" });
}

module.exports = {
  getStats,
  getTransactions,
  getPayrollActivity,
  getUpcomingPayrolls,
  getRecentActivity,
  getExpenseBreakdown,
  getPerformanceSummary,
  getComplianceSnapshot,
  getRiskSignals,
  getDashboardAlerts,
  getForecast,
  health,
};
