/**
 * Fix: currency default was double-quoted("'USD'") which node-pg-migrate escaped
 * into a 5-char literal including quotes
 */

/**@type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.alterColumn("accounts", "currency", {
    default: "USD",
  });
};

/**@type {import('node-pg-migrate').MigrationBuilder} */
exports.down = (pgm) => {
  // Restores the previous BROKEN default so down() actually reverses the migration above
  pgm.alterColumn("account", "currency", {
    default: "'USD'",
  });
};
