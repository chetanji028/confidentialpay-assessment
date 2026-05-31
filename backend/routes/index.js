const { Router } = require("express");
const { requireAuth } = require("../middleware/auth.js");
const authController = require("../controllers/authController.js");
const dashboardController = require("../controllers/dashboardController.js");
const payrollController = require("../controllers/payrollController.js");
const employeeController = require("../controllers/employeeController.js");
const treasuryController = require("../controllers/treasuryController.js");
const complianceController = require("../controllers/complianceController.js");
const settingsController = require("../controllers/settingsController.js");

// Express router for the ConfidentialPay API. This backend uses Node.js + Express only.
const router = Router();

router.get("/", (_req, res) => res.json({ ok: true, service: "confidentialpay-backend" }));

router.post("/api/auth/login", authController.login);
router.post("/api/auth/logout", authController.logout);
router.post("/api/auth/refresh", requireAuth, authController.refresh);
router.post("/api/auth/forgot-password", authController.forgotPassword);
router.post("/api/auth/reset-password", authController.resetPassword);
router.get("/api/auth/me", requireAuth, authController.me);

router.get("/api/dashboard/stats", requireAuth, dashboardController.getStats);
router.get("/api/dashboard/transactions", requireAuth, dashboardController.getTransactions);
router.get("/api/dashboard/payroll-activity", requireAuth, dashboardController.getPayrollActivity);
router.get("/api/dashboard/upcoming-payrolls", requireAuth, dashboardController.getUpcomingPayrolls);

router.get("/api/payroll/employees", requireAuth, payrollController.getPayrollEmployees);
router.post("/api/payroll/execute", requireAuth, payrollController.executePayroll);
router.post("/api/payroll/schedule", requireAuth, payrollController.createScheduledPayroll);
router.get("/api/payroll/scheduled", requireAuth, payrollController.listScheduledPayrolls);
router.put("/api/payroll/scheduled/:id", requireAuth, payrollController.updateScheduledPayroll);
router.delete("/api/payroll/scheduled/:id", requireAuth, payrollController.deleteScheduledPayroll);
router.get("/api/payroll/history", requireAuth, payrollController.getPayrollHistory);
router.get("/api/payroll/templates", requireAuth, payrollController.getPayrollTemplates);
router.post("/api/payroll/templates", requireAuth, payrollController.createPayrollTemplate);

router.get("/api/employees", requireAuth, employeeController.listEmployees);
router.get("/api/employees/:id", requireAuth, employeeController.getEmployee);
router.post("/api/employees", requireAuth, employeeController.createEmployee);
router.put("/api/employees/:id", requireAuth, employeeController.updateEmployee);
router.delete("/api/employees/:id", requireAuth, employeeController.deleteEmployee);
router.post("/api/employees/bulk-import", requireAuth, employeeController.bulkImportEmployees);

router.get("/api/bridge", requireAuth, treasuryController.getBridgeOverview);
router.get("/api/treasury/balances", requireAuth, treasuryController.getBalances);
router.get("/api/treasury/transactions", requireAuth, treasuryController.getTreasuryTransactions);
router.post("/api/treasury/deposit", requireAuth, treasuryController.deposit);
router.post("/api/treasury/withdraw", requireAuth, treasuryController.withdraw);
router.post("/api/treasury/bridge", requireAuth, treasuryController.bridge);

router.get("/api/compliance", requireAuth, complianceController.getComplianceSummary);
router.get("/api/compliance/score", requireAuth, complianceController.getComplianceScore);
router.get("/api/compliance/status", requireAuth, complianceController.getComplianceStatus);
router.get("/api/compliance/audit", requireAuth, complianceController.getComplianceAudit);
router.post("/api/compliance/reports/generate", requireAuth, complianceController.generateComplianceReport);

router.get("/api/settings", requireAuth, settingsController.getSettingsHandler);
router.put("/api/settings", requireAuth, settingsController.updateSettingsHandler);
router.get("/api/settings/team", requireAuth, settingsController.getTeamSettings);

module.exports = router;
