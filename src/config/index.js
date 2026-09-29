const path = require("path");

// load .env file - this must come first before we try to read any environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

/**
 * This function reads an environment variable. It will throw an error on startup if variables
 * are missing and there is no provided default.
 *
 * Why do we do this?
 *
 * This is 'fail fast' - this turns a silent error into a loud error, so we know immediately our
 * environment variables are missing. This is important because our app absolutely needs those variables
 */

function required(name) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Check your .env file against .env.example`,
    );
  }
  return value;
}

function optional(name, defaultValue) {
  return process.env[name] || defaultValue;
}

const config = {
  port: parseInt(optional("PORT", "3000"), 10),
  nodeEnv: optional("NODE_ENV", "development"),
  isDev: optional("NODE_ENV", "development") === "development",
  isProd: process.env.NODE_ENV === "production",
  db: {
    url: required("DATABASE_URL"),
  },
};

module.exports = config;
