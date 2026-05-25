const { employees, scheduled, templates, transactions } = require("../models/mockData.js");

function getPayrollEmployees(_req, res) {
  return res.json({ items: employees });
}

function executePayroll(req, res) {
  const { employeeIds = [], chain = "BNB", privacy = "high" } = req.body ?? {};

  return res.json({
    ok: true,
    txId: "0x" + Math.random().toString(16).slice(2, 10),
    employeeIds,
    chain,
    privacy,
    timestamp: new Date().toISOString(),
  });
}

function createScheduledPayroll(req, res) {
  const item = { id: "s" + Date.now(), ...req.body, status: "scheduled" };
  scheduled.push(item);
  return res.json({ ok: true, item });
}

function listScheduledPayrolls(_req, res) {
  return res.json({ items: scheduled });
}

function updateScheduledPayroll(req, res) {
  const index = scheduled.findIndex((entry) => entry.id === req.params.id);

  if (index < 0) {
    return res.status(404).json({ error: "Not found" });
  }

  scheduled[index] = { ...scheduled[index], ...req.body };
  return res.json({ ok: true, item: scheduled[index] });
}

function deleteScheduledPayroll(req, res) {
  const index = scheduled.findIndex((entry) => entry.id === req.params.id);

  if (index < 0) {
    return res.status(404).json({ error: "Not found" });
  }

  scheduled.splice(index, 1);
  return res.json({ ok: true });
}

function getPayrollHistory(_req, res) {
  return res.json({ items: transactions.filter((entry) => entry.type === "payroll") });
}

function getPayrollTemplates(_req, res) {
  return res.json({ items: templates });
}

function createPayrollTemplate(req, res) {
  const item = { id: "t" + Date.now(), lastUsed: new Date().toISOString().slice(0, 10), ...req.body };
  templates.push(item);
  return res.json({ ok: true, item });
}

function previewPayroll(req, res) {
  const { employeeIds = [], chain = "BNB" } = req.body ?? {};
  const total = employeeIds.length * 2500;
  return res.json({ ok: true, preview: { employeeCount: employeeIds.length, estimatedTotal: total, chain, fees: total * 0.01 } });
}

function getPayrollSummary(_req, res) {
  return res.json({ totalScheduled: scheduled.length, totalTemplates: templates.length, totalTransactions: transactions.filter((entry) => entry.type === "payroll").length, lastExecuted: "2024-05-01" });
}

function pauseScheduledPayroll(req, res) {
  const item = scheduled.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  item.status = "paused";
  return res.json({ ok: true, item });
}

function resumeScheduledPayroll(req, res) {
  const item = scheduled.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  item.status = "scheduled";
  return res.json({ ok: true, item });
}

function duplicateTemplate(req, res) {
  const template = templates.find((entry) => entry.id === req.params.id);
  if (!template) return res.status(404).json({ error: "Not found" });
  const copy = { ...template, id: "t" + Date.now(), name: `${template.name} Copy` };
  templates.push(copy);
  return res.json({ ok: true, item: copy });
}

function getTemplateUsage(req, res) {
  return res.json({ items: templates.map((entry) => ({ id: entry.id, name: entry.name, lastUsed: entry.lastUsed })) });
}

function getPayrollLedger(_req, res) {
  return res.json({ items: transactions.slice(0, 10) });
}

function getPayrollQueue(_req, res) {
  return res.json({ items: scheduled.map((entry) => ({ ...entry, queuePosition: 1 })) });
}

function health(_req, res) {
  return res.json({ ok: true, service: "payroll" });
}

module.exports = {
  getPayrollEmployees,
  executePayroll,
  createScheduledPayroll,
  listScheduledPayrolls,
  updateScheduledPayroll,
  deleteScheduledPayroll,
  getPayrollHistory,
  getPayrollTemplates,
  createPayrollTemplate,
  previewPayroll,
  getPayrollSummary,
  pauseScheduledPayroll,
  resumeScheduledPayroll,
  duplicateTemplate,
  getTemplateUsage,
  getPayrollLedger,
  getPayrollQueue,
  health,
};
