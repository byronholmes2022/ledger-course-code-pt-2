const db = require("./index");

/**
 * Data access for accounts.
 *
 * Every function here:
 * - Takes plain values (ids, objects), never req/res
 * - Returns plain objects or arrays, never HTTP-shaped things
 * - Uses parameterized queries ($1, $2), never interpolation
 * - Throws on database errors (which bubble up to the error middleware)
 *
 * Notice what's NOT here:
 * - No "if name is empty, throw validation error" — that's the service's job
 * - No "return res.status(404)" — this layer doesn't know HTTP exists
 * - No business logic ("can this user create another account?") — service layer
 */

async function findAll({ limit = 20, offset = 0 } = {}) {
  const { rows } = await db.query(
    `SELECT a.*, c.name AS default_category_name
        FROM accounts a
        LEFT JOIN categories c ON a.default_category_id = c.id
        ORDER by a.name ASC
        LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return rows;
}

async function findById(id) {
  const {
    rows: [account],
  } = await db.query(
    `
    SELECT a.*, c.name AS default_category_name
    FROM accounts a
    LEFT JOIN categories c ON a.default_category_id = c.id
    WHERE a.id = $1`,
    [id],
  );

  return account || null;
}

async function count() {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS total FROM accounts`,
  );
  return rows[0].total;
}

async function deleteById(id) {
  const {
    rows: [deleted],
  } = await db.query(
    `
    DELETE FROM accounts WHERE id=$1 RETURNING *`,
    [id],
  );

  return deleted || null;
}

async function create({
  name,
  account_type,
  institution,
  currency,
  is_active,
  default_category_id,
}) {
  const {
    rows: [account],
  } = await db.query(
    `
    INSERT INTO accounts(
    name, 
    account_type, 
    institution, 
    currency, 
    is_active, 
    default_category_id)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, account_type, institution, currency, is_active, default_category_id],
  );
  return account;
}
// {name:
//   "new acct name",
//   account_type:"new acct_type"
// }
async function updateById(id, fields) {
  const UPDATABLE = [
    "name",
    "account_type",
    "currency",
    "default_category_id",
    "is_active",
    "institution",
  ];

  const cols = UPDATABLE.filter((col) => Object.hasOwn(fields, col));
  if (cols.length === 0) return findById(id);
  const values = cols.map((col) => fields[col]);
  const setClauses = cols.map((col, i) => `${col} = $${i + 1}`);
  setClauses.push("updated_at = now()");
  values.push(id);

  const {
    rows: [updated],
  } = await db.query(
    `
    UPDATE accounts
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );
  return updated || null;
}

module.exports = { findAll, findById, count, deleteById, create, updateById };
