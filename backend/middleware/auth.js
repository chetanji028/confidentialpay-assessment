const jwt = require("jsonwebtoken");
const { ADMIN_USER, VALID_EMAIL } = require("../models/mockData.js");

const JWT_SECRET = process.env.JWT_SECRET ?? "confidentialpay-dev-secret-change-me";

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);

    if (payload.email !== VALID_EMAIL) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = ADMIN_USER;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
