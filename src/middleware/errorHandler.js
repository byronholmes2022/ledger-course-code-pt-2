const config = require("../config");
<<<<<<< HEAD
/**
 * Temporary error-handling middleware.
 *
 * Week 3 replaces this with a proper centralized handler using custom
 * error classes, environment-aware responses, and Postgres error mapping.
 * For now, this catches thrown errors and returns them as JSON.
 */
=======
>>>>>>> e7b135b (added lesson 2 code)

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

<<<<<<< HEAD
  // in development, include stack trace for debugging.
  // in production, never expose it (security risk - reveals file paths, library versions, etc)
=======
>>>>>>> e7b135b (added lesson 2 code)
  const response = {
    error: message,
  };

<<<<<<< HEAD
  if (!config.isProd) {
    response.stack = err.stack;
  }

  // log the error server-side regardless
  if (statusCode >= 500) {
    console.error("Unhandled error", err);
=======
  // in development NEVER send the stack trace to the frontend - exposes things like libraries, file paths, etc
  if (config.isDev) {
    response.stack = err.stack;
  }

  // Either way, we want to log the error server-side
  if (statusCode >= 500) {
    console.log("Unhandled error:", err);
>>>>>>> e7b135b (added lesson 2 code)
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
