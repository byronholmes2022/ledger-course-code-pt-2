/**
 * Adds default_category_id to accounts table.
 *
 * Why a separate migration instead of adding it to the accounts table
 * creation? Because the accounts table already exists in the database.
 * Each migration is a change from one state to the next.
 *
 * default_category_id is nullable — most accounts don't have a default
 * category. But some special-purpose accounts always map to the same
 * spending category: your auto loan payments always go to
 * "Transportation," your mortgage always goes to "Housing." Setting a
 * default category saves time when transactions from that account are
 * categorized later.
 */

export const up = (pgm) => {
  pgm.addColumn("accounts", {
    default_category_id: {
      type: "integer",
      references: "categories",
      onDelete: "SET NULL",
    },
  });

  // Index the foreign key — Postgres does NOT auto-index foreign keys.
  // Without this, every query that joins accounts to categories does a
  // sequential scan on accounts looking for matching default_category_ids.
  pgm.createIndex("accounts", "default_category_id");
};

export const down = (pgm) => {};
