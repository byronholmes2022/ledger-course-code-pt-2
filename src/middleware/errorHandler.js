const { AppError } = require("../utils/errorClasses");
const config = require("../config");

/**
 * Centralized error handler for Ledger
 *
 * ONE PLACE where errors become HTTP responses
 * 'ONE PLACE' = *every* error in the entire app winds up here - whether thrown
 * by service, data access function, middleware or express itself
 *
 * This middleware makes one critical decision: is this error
 * operational (expected and we can handle it) or is it an actual bug (programming/logic error)?
 * Operational error? -> send the specific status and message
 * Programming error? -> send a generic 500, and log everything *on the backend*
 */

function errorHandler(err, req, res, next) {
  let statusCode;
  let message;
  let details;

  if (err instanceof AppError) {
    // -- Operational Error ---
    statusCode = err.statusCode;
    message = err.message;

    // ValidationError carries field-level details
    if (err.details && err.details.length > 0) {
      details = err.details;
    }
  } else if (err.type === "entity.parse.failed") {
    // Malformed JSON from express.json()
    // Treat it as a 400 (Bad input), NOT a 500 (a server bug)
    statusCode = 400;
    message = "Invalid JSON in request body";
  } else {
    // -- Programming error (actual bug) --
    // DON'T LEAK INTERNALS TO THE CLIENT!!!
    statusCode = 500;
    message = "Internal Server Error";

    // Log the full error - remember this console.log logs out in the server only
    // In Workbook 21, this becomes structured logging with pino
    console.error("UNEXPECTED ERROR", {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });
  }

  const response = { error: message };

  if (details) {
    response.details = details;
  }

  // In development, we include the stack trace for debugging.
  // In production NEVER expose it - it reveals file paths, library versions and app structure
  if (!config.isProd) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
