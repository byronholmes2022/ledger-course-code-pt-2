<<<<<<< HEAD
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
=======
const { findAll, count } = require("../db/accounts");

async function listAccounts({ page = 1, limit = 20 } = {}) {
  // convert page number to offset
  console.log(limit);
  const offset = (page - 1) * limit;
  const [accounts, total] = await Promise.all([
    findAll({ limit, offset }),
    count(),
>>>>>>> e7b135b (added lesson 2 code)
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

<<<<<<< HEAD
async function getAccountById(id) {
  const account = await accountDb.findById(id);
  if (!account) {
    const error = new Error(`Account with id ${id} not found!`);
    error.statusCode = 404;
    throw error;
  }
  return account;
}

module.exports = { listAccounts, getAccountById };
=======
module.exports = {
  listAccounts,
};
>>>>>>> e7b135b (added lesson 2 code)
