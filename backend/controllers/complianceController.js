const { employees, transactions } = require("../models/mockData.js");

function getComplianceScore(_req, res) {
  return res.json({ score: 96, kyc: 95, aml: 88, tax: 92, privacy: 96 });
}

function getComplianceSummary(_req, res) {
  return res.json({
    policyHealth: "98%",
    auditTrail: 24,
    openIssues: 2,
    checks: [
      { id: "c1", name: "KYC Verification", detail: "All employees verified", status: "pass" },
      { id: "c2", name: "AML Review", detail: "No high-risk transactions", status: "warning" },
      { id: "c3", name: "Tax Filing", detail: "Q2 documents signed", status: "pass" },
    ],
  });
}

function getComplianceStatus(_req, res) {
  return res.json({
    company: { verified: true, documents: 3, total: 3 },
    employees: employees.slice(0, 6).map((entry, index) => ({
      id: entry.id,
      name: entry.name,
      level: index % 2 === 0 ? "Full" : "Basic",
      documents: index % 2 === 0 ? 3 : 1,
      total: 3,
      status: index % 3 === 0 ? "verified" : "pending",
    })),
  });
}

function getComplianceAudit(_req, res) {
  return res.json({ items: transactions.map((entry) => ({ ...entry, audit: entry.status === "completed" ? "pass" : "review" })) });
}

function generateComplianceReport(req, res) {
  return res.json({ ok: true, reportId: "r" + Date.now(), ...req.body });
}

module.exports = {
  getComplianceScore,
  getComplianceSummary,
  getComplianceStatus,
  getComplianceAudit,
  generateComplianceReport,
};
