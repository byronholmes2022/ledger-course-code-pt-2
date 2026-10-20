const config = require("../config");
/**
 * Temporary error-handling middleware.
 *
 * Week 3 replaces this with a proper centralized handler using custom
 * error classes, environment-aware responses, and Postgres error mapping.
 * For now, this catches thrown errors and returns them as JSON.
 */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // in development, include stack trace for debugging.
  // in production, never expose it (security risk - reveals file paths, library versions, etc)
  const response = {
    error: message,
  };

  if (!config.isProd) {
    response.stack = err.stack;
  }

  // log the error server-side regardless
  if (statusCode >= 500) {
    console.error("Unhandled error", err);
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
