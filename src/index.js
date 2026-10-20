const express = require("express");
const config = require("./config");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "error", message: "Database unreachable" });
  }
});

// API routes
app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/categories", require("./routes/categories"));

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Ledger API",
    version: "0.1.0",
  });
});

// Centralized error handler — MUST be after all routes
// Express identifies error middleware by the 4-argument signature
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});
