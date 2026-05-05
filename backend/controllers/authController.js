const jwt = require("jsonwebtoken");
const { ADMIN_USER, VALID_EMAIL, VALID_PASSWORD } = require("../models/mockData.js");

const JWT_SECRET = process.env.JWT_SECRET ?? "confidentialpay-dev-secret-change-me";

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function normalizeLoginPayload(body = {}) {
  return {
    email: String(body.email ?? "").trim().toLowerCase(),
    password: String(body.password ?? ""),
    rememberMe: Boolean(body.rememberMe),
    device: String(body.device ?? "web"),
    region: String(body.region ?? "global"),
  };
}

function buildSessionSummary(user) {
  return {
    user,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    tokenType: "Bearer",
    permissions: ["read:dashboard", "write:payroll", "read:employees", "write:settings"],
  };
}

function login(req, res) {
  const payload = normalizeLoginPayload(req.body);

  if (payload.email !== VALID_EMAIL || payload.password !== VALID_PASSWORD) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createToken({ email: payload.email, role: "admin" });
  const refreshToken = createRefreshToken({ email: payload.email, role: "admin" });
  return res.json({
    token,
    refreshToken,
    user: ADMIN_USER,
    session: buildSessionSummary(ADMIN_USER),
    loginMeta: {
      device: payload.device,
      rememberMe: payload.rememberMe,
      region: payload.region,
    },
  });
}

function logout(_req, res) {
  return res.json({ ok: true, message: "Session revoked", revokedAt: new Date().toISOString() });
}

function refresh(req, res) {
  const token = createToken({ email: req.user.email, role: "admin" });
  const refreshToken = createRefreshToken({ email: req.user.email, role: "admin" });
  return res.json({ token, refreshToken, user: req.user, session: buildSessionSummary(req.user) });
}

function forgotPassword(req, res) {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  return res.json({
    ok: true,
    message: `Reset link sent to ${email || "your email"}`,
    delivery: "queued",
    expiresIn: "15m",
    supportEmail: "support@confidentialpay.com",
  });
}

function resetPassword(_req, res) {
  return res.json({ ok: true, message: "Password reset successful", changedAt: new Date().toISOString() });
}

function me(req, res) {
  return res.json({ user: req.user, session: buildSessionSummary(req.user) });
}

function verifyToken(req, res) {
  const authorization = req.headers.authorization ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, payload });
  } catch {
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
}

function profile(req, res) {
  return res.json({ user: req.user, preferences: { theme: "dark", language: "en", notifications: true } });
}

function updateProfile(req, res) {
  return res.json({ ok: true, message: "Profile updated", changes: req.body });
}

function permissions(req, res) {
  return res.json({
    ok: true,
    permissions: [
      { name: "read:dashboard", granted: true },
      { name: "write:payroll", granted: true },
      { name: "read:employees", granted: true },
      { name: "write:settings", granted: true },
    ],
  });
}

function auditLog(req, res) {
  return res.json({
    ok: true,
    entries: [
      { id: "a1", action: "login", timestamp: new Date().toISOString(), user: req.user.email },
      { id: "a2", action: "refresh", timestamp: new Date().toISOString(), user: req.user.email },
    ],
  });
}

function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }
  return res.json({ ok: true, message: "Password changed", changedAt: new Date().toISOString() });
}

function twoFactorSetup(req, res) {
  return res.json({ ok: true, secret: "JBSWY3DPEHPK3PXP", otpauthUrl: "otpauth://totp/ConfidentialPay:admin" });
}

function logoutAll(req, res) {
  return res.json({ ok: true, message: "All sessions revoked", revokedAt: new Date().toISOString() });
}

function impersonate(req, res) {
  return res.json({ ok: true, message: "Impersonation not available in demo mode", requestedBy: req.user.email });
}

function getSecuritySettings(req, res) {
  return res.json({ ok: true, security: { mfaEnabled: false, passwordLastChanged: "2024-05-01", sessionTimeout: 7200 } });
}

function health(req, res) {
  return res.json({ ok: true, service: "auth", uptime: process.uptime().toFixed(2) });
}

module.exports = { login, logout, refresh, forgotPassword, resetPassword, me, verifyToken, profile, updateProfile, permissions, auditLog, changePassword, twoFactorSetup, logoutAll, impersonate, getSecuritySettings, health };
