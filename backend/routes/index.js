const { Router } = require("express");
const { requireAuth } = require("../middleware/auth.js");
const authController = require("../controllers/authController.js");
const dashboardController = require("../controllers/dashboardController.js");
const complianceController = require("../controllers/complianceController.js");

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

router.get("/api/compliance", requireAuth, complianceController.getComplianceSummary);
router.get("/api/compliance/score", requireAuth, complianceController.getComplianceScore);
router.get("/api/compliance/status", requireAuth, complianceController.getComplianceStatus);
router.get("/api/compliance/audit", requireAuth, complianceController.getComplianceAudit);
router.post("/api/compliance/reports/generate", requireAuth, complianceController.generateComplianceReport);

module.exports = router;
