const { Pool } = require("pg");
const config = require("../config");

const pool = new Pool({ connectionString: config.db.url });

// Log when the pool connects - useful in development
pool.on("connect", () => {
  console.log("Database pool: new client connect");
});

// Log pool errors (e.g. connections dropping, etc)
pool.on("error", (err) => {
  console.log("Database pool: unexpected error on idle client", err);
  process.exit(1);
});

/**
 * Run a query against the pool.
 * Usage: const {rows} = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Exporting the pool directly for later use
};
