const { employees } = require("../models/mockData.js");
const { Order } = require("../models/order.js");
const order = new Order();
function listEmployees(_req, res) {
  return res.json({ items: employees });
}

function getEmployee(req, res) {
  const employee = employees.find((entry) => entry.id === req.params.id);

  if (!employee) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({ employee, totalPaid: employee.salary * 5, payrollCount: 5 });
}

function createEmployee(req, res) {
  const item = { id: "e" + Date.now(), status: "active", lastPaid: "—", ...req.body };
  employees.push(item);
  return res.json({ ok: true, item });
}

function updateEmployee(req, res) {
  const index = employees.findIndex((entry) => entry.id === req.params.id);

  if (index < 0) {
    return res.status(404).json({ error: "Not found" });
  }

  employees[index] = { ...employees[index], ...req.body };
  return res.json({ ok: true, item: employees[index] });
}

function deleteEmployee(req, res) {
  const index = employees.findIndex((entry) => entry.id === req.params.id);

  if (index < 0) {
    return res.status(404).json({ error: "Not found" });
  }

  employees.splice(index, 1);
  return res.json({ ok: true });
}

function bulkImportEmployees(req, res) {
  const rows = req.body?.items ?? [];

  rows.forEach((entry) => employees.push({ id: "e" + Date.now() + Math.random(), status: "active", lastPaid: "—", ...entry }));

  return res.json({ ok: true, imported: rows.length });
}

function searchEmployees(req, res) {
  const query = String(req.query.q ?? "").toLowerCase();
  const filtered = employees.filter((entry) => [entry.name, entry.email, entry.role].some((value) => String(value).toLowerCase().includes(query)));
  return res.json({ items: filtered });
}

function deactivateEmployee(req, res) {
  const employee = employees.find((entry) => entry.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: "Not found" });
  }
  employee.status = "inactive";
  return res.json({ ok: true, item: employee });
}

function activateEmployee(req, res) {
  const employee = employees.find((entry) => entry.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: "Not found" });
  }
  employee.status = "active";
  return res.json({ ok: true, item: employee });
}

function getEmployeeStats(_req, res) {
  return res.json({
    total: employees.length,
    active: employees.filter((entry) => entry.status === "active").length,
    inactive: employees.filter((entry) => entry.status === "inactive").length,
    pending: employees.filter((entry) => entry.status === "pending").length,
    avgSalary: Math.round(employees.reduce((sum, entry) => sum + entry.salary, 0) / employees.length),
  });
}

function getEmployeeTimeline(req, res) {
  const employee = employees.find((entry) => entry.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.json({ employeeId: employee.id, events: [{ type: "created", timestamp: "2024-01-01" }, { type: "payroll", timestamp: "2024-05-01" }] });
}

function exportEmployees(_req, res) {
  return res.json({ ok: true, fileName: "employees-export.json", items: employees });
}

function importEmployeeNotes(req, res) {
  return res.json({ ok: true, message: "Notes imported", received: req.body?.items?.length ?? 0 });
}

function getEmployeeDocuments(req, res) {
  const employee = employees.find((entry) => entry.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.json({ employeeId: employee.id, documents: [{ name: "Offer Letter.pdf", status: "signed" }, { name: "KYC.pdf", status: "verified" }] });
}

function health(_req, res) {
  return res.json({ ok: true, service: "employees" });
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkImportEmployees,
  searchEmployees,
  deactivateEmployee,
  activateEmployee,
  getEmployeeStats,
  getEmployeeTimeline,
  exportEmployees,
  importEmployeeNotes,
  getEmployeeDocuments,
  health,
};
