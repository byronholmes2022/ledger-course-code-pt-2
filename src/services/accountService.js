const accountDb = require("../db/accounts");

/**
 * Service layer for accounts.
 *
 * Every function here:
 * - Takes plain values, never req/res
 * - Returns plain data or throws errors
 * - Contains the business rules ("is this allowed? is this valid?")
 * - Calls the data access layer, never writes SQL directly
 *
 * Right now the business logic is thin — accounts are just a catalogue.
 * As the app grows (transaction ledger, balances, budgets, Plaid
 * integration), this layer is where those rules live. Setting up the
 * layer now means they have a home when they arrive.
 */

async function listAccounts({ page = 1, limit = 20 } = {}) {
  // Convert page number to offset
  const offset = (page - 1) * limit;
  const [accounts, total] = await Promise.all([
    accountDb.findAll({ limit, offset }),
    accountDb.count(),
  ]);

  return {
    data: accounts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getAccountById(id) {
  const account = await accountDb.findById(id);
  if (!account) {
    const error = new Error(`Account with id ${id} not found!`);
    error.statusCode = 404;
    throw error;
  }
  return account;
}

async function createAccount(data) {
  return accountDb.create(data);
}

async function updateAccount(id, data) {
  const account = await accountDb.updateById(id, data);
  if (!account) {
    const error = new Error(`Account with id ${id} not found!`);
    error.statusCode = 404;
    throw error;
  }
  return account;
}

async function deleteAccountById(id) {
  const deleted = await accountDb.deleteById(id);
  if (!deleted) {
    const error = new Error(`Account with id ${id} not found!`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

module.exports = {
  listAccounts,
  getAccountById,
  deleteAccountById,
  createAccount,
  updateAccount,
};
