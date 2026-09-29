const express = require("express");
const config = require("./config");
const db = require("./db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check point  - this will be important later in deployment and then in monitoring
app.get("/health", async (req, res) => {
  try {
    // Check database connectivity
    await db.query("SELECT 1");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "error", message: "database unreachable" });
  }
});

<<<<<<< HEAD
// API Routes
app.use("/api/accounts", require("./routes/accounts"));

// Root
=======
app.use("/api/accounts", require("./routes/account"));

>>>>>>> e7b135b (added lesson 2 code)
app.get("/", (req, res) => {
  res.json({
    message: "Ledger API",
    version: "0.1.0",
  });
});

<<<<<<< HEAD
// Centralized error handler - MUST be after all routes
// Express identifies error middleware by the 4-argument signature
=======
>>>>>>> e7b135b (added lesson 2 code)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});
