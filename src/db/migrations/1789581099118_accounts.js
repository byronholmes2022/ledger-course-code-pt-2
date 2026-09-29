/**
 * First migration: the accounts table.
 *
 * This is the core resource — the financial accounts being tracked.
 * Starting simple: just the account itself, not the transaction ledger
 * or computed balances yet. Those come later as the curriculum builds up.
 *
 * Design decisions:
 * - Using SERIAL for id (auto-incrementing integer) for simplicity.
 *   You'll likely switch to UUIDs later, but for Week 1, integers are
 *   easier to work with and debug.
 * - Including currency from day one. Retrofitting multi-currency later
 *   touches every table and every calculation. Modeling it now (even if
 *   the UI only supports USD at first) is cheap insurance.
 * - Including account_type as an enum-like constraint. In personal
 *   finance, the type of account (checking, savings, credit card, cash)
 *   determines sign conventions and behavior. Getting this wrong early
 *   creates subtle bugs in balance calculations.
 * - NOT including a balance column. This is the single most important
 *   architectural decision in the project. Balances will be derived from
 *   the transaction ledger (a later migration). A mutable balance column
 *   is how you get data that doesn't add up — two requests update the
 *   same balance simultaneously, a transaction is deleted but the balance
 *   isn't adjusted, a bug sets it to the wrong number and nobody notices
 *   for weeks. The ledger is the source of truth; the balance is always
 *   calculated.
 */

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.createTable("accounts", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    account_type: {
      type: "varchar(50)",
      notNull: true,
      comment:
        "One of: checking, savings, credit_card, cash, investment, loan, other",
    },
    institution: {
      type: "varchar(255)",
      comment: "Bank or institution name (e.g., Chase, Vanguard)",
    },
    currency: {
      type: "varchar(3)",
      notNull: true,
      default: "'USD'",
      comment: "ISO 4217 currency code",
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
      comment: "Soft-delete flag — inactive accounts are hidden, not removed",
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

  // Index on account_type for filtered queries (e.g., "show me all
  // credit cards"). This is an example of indexing a column you'll
  // frequently filter on.
  pgm.createIndex("accounts", "account_type");
};

exports.down = (pgm) => {
  pgm.dropTable("accounts");
};
