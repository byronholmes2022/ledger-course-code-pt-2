/**
 * Categories for classifying transactions.
 *
 * In the personal finance domain: Housing, Food & Dining, Transportation,
 * Utilities, Entertainment, Healthcare, Income, Transfers, etc.
 *
 * Design decisions:
 * - Keeping it simple: name and optional description.
 * - NOT doing nested categories (subcategories like Food > Groceries
 *   > Whole Foods). That's a tree structure that adds real complexity
 *   and isn't needed yet. If you need it later, you add a parent_id —
 *   but don't add it now "just in case."
 */

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.createTable("categories", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },
    description: {
      type: "text",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = (pgm) => {
  pgm.dropTable("categories");
};
