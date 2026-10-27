/*
  Custom error classes for Ledger
  These solve 3 problems:
    1. these carry the HTTP codes so our service layer and data layer don't have to
       - e.g. the service/dal will throw a NotFoundError, instead of a 404
    2. these will mark an error as 'operational' or not (by using boolean).
       this matters because operational errors are expected and handleable. 
       The EHM will use this to decide what to show the client
    3. these give the codebase a shared vocabulary. When you see NotFoundError, you 
       know exactly what happened. If you see a plain Error object, something broke.
*/

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = this.constructor.name;
  }
}

// for 404 - Resource not found - this is specifically for cases where
// a resource was requested by ID and doesn't exist. NOT for empty list results -
// an empty list is a valid response
class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

// For 400 - Bad Input - throws whenever the client sends a value that the app can't accept
// now, it will be constraint and format failures. After Lesson 5, Zod validation errors
// will be converted into these as well
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

// For 409 - Conflict
// Used when the request conflicts with the current db state, e.g. a duplicate category name
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
};
