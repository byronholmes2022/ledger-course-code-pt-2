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

/*
  Builds the 'details' array for a ValidationError. Postgres only reports
  the failing column for some errors, so this returns an empty array when there is 
  no field to point at. But if there is a field or fields to point at, we want to let
  the end user know (e.g. they're missing their password)
*/
function fieldDetails(field, message) {
  return field ? [{ field, message }] : [];
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
        /* TODO Lessons 6 and 8 - constraints that don't follow the default naming
        convention won't match uniqueColumns and fall back to the generic message
        - e.g. custom index names (users_email_lower_idx) and multi-column
        constraints (UNIQUE(user_id, name)). Add exact-name matching then */
        const message =
          (column && context.uniqueColumns?.[column]) ||
          "A record with this value already exists";

        throw new ConflictError(message);
      }

      case "23503": {
        /*
          Handles INSERT/UPDATE pointing at a row that does not exist. 
          Todo - Lesson 9: a DELETE blocked by ON DELETE RESTRICT also raises
          this error code This branch currently would mislabel it as 'does not exist' (400)
          so don't wrap parent deletes with this until that's handled (the appropriate status code here will be 409)
        */
        const message =
          (column && context.foreignKeys?.[column]) ||
          (column
            ? `Referenced ${humanize(column)} does not exist`
            : `Referenced record does not exist`);
        throw new ValidationError(message, fieldDetails(column, message));
      }

      case "23502": {
        // Postgres reports the column directly for NOT NULL
        const message = `${err.column || "A required field"} is required`;
        throw new ValidationError(message, fieldDetails(err.column, message));
      }

      case "23514":
        throw new ValidationError("Value does not meet requirements");

      case "22P02":
        // Postgres doesn't report which value failed to parse
        throw new ValidationError("Invalid value format");

      case "22001":
        // Postgres doesn't report the column that overflowed
        throw new ValidationError("Value is too long");

      default:
        // Unknown Postgres error - rethrow a generic Error object. The error middleware
        // will treat it as a programming error (500) and log it for backend team
        throw err;
    }
  }
}

module.exports = handlePgError;
