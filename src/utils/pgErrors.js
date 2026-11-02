const { ConflictError, ValidationError } = require("./errorClasses");

/**
 * Maps Postgres error codes to AppError subclasses
 * 23505 - unique_violation (duplicate value on a unique column) -> ConflictError
 * 23503 - foreign_key_violation (referencing a row that doesn't exist) -> ValidationError
 * 23502 - not_null_violation (null into a NOT NULL column) -> ValidationError
 */

// Helper function that will parse certain constraints and get the column name from them
// when name follows convention <table>_<column>_key or  <table>_<column>_fkey
// returns null if name does NOT follow the convention

function extractColumnFromConstraint(constraint, table) {
  if (!constraint || !table) return null;
  const prefix = `${table}_`;
  if (!constraint.startsWith(prefix)) return null;
  const match = constraint.slice(prefix.length).match(/^(.+)_(key|fkey)$/);
  return match ? match[1] : null;
}

// "default_category_id" -> "default category"
function humanize(column) {
  return column.replace(/_id$/, "").replace(/_/g, " ");
}

async function handlePgError(operation, context = {}) {
  try {
    return await operation();
  } catch (err) {
    // For now, if no err code, it's not a Postgres code, so it's not a Postgres error,
    // it's a programming error

    if (!err.code) throw err;

    const column = extractColumnFromConstraint(err.constraint, err.table);
    switch (err.code) {
      case "23505": {
        const message =
          (column && context.uniqueColumns?.[column]) ||
          "A record with this value already exists";

        throw new ConflictError(message);
      }

      default:
        // Unknown Postgres error - rethrow a generic Error object. The error middleware
        // will treat it as a programming error (500) and log it for backend team
        throw err;
    }
  }
}

module.exports = { handlePgError };
