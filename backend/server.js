const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const router = require("./routes/index.js");

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? "*").split(",").map((value) => value.trim());

app.use(cors({ origin: CORS_ORIGIN.includes("*") ? true : CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60_000, max: 240 }));
app.use(router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✓ ConfidentialPay API listening on http://localhost:${PORT}`);
});
