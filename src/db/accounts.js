const db = require("./index");

<<<<<<< HEAD
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
        ORDER BY a.name ASC
        LIMIT $1 OFFSET $2`,
=======
async function findAll({ limit = 20, offset = 0 } = {}) {
  const { rows } = await db.query(
    `
    SELECT a.*, c.name AS default_category_name
    FROM accounts a
    LEFT JOIN categories c ON a.default_category_id = c.id
    ORDER BY a.name ASC
    LIMIT $1 OFFSET $2
    `,
>>>>>>> e7b135b (added lesson 2 code)
    [limit, offset],
  );
  return rows;
}

<<<<<<< HEAD
async function findById(id) {
  const { rows } = await db.query(
    `SELECT a.*, c.name
        FROM accounts a
        LEFT JOIN categories c ON a.default_category_id = c.id
        WHERE a.id = $1`,
    [id],
  );
  return rows[0] || null;
}

async function updateById(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findById(id);
  const acceptedFields = new Set([
    "name",
    "account_type",
    "institution",
    "currency",
    "is_active",
  ]);
  const filteredkeys = (key) => acceptedFields.has(key);
  const setClauses = filteredkeys.map((key, i) => `${key} = $${i + 1}`);
  setClauses.push(`updated_at = now()`);
  const values = filteredkeys.map((key) => fields[key]);
  values.push(id);

  const { rows } = await db.query(
    `
    UPDATE categories
    SET ${setClauses.join(", ")}
    WHERE id = $${values.length}
    RETURNING *`,
    values,
  );

  return rows[0] || null;
}

async function count() {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS total FROM accounts`,
  );
  return rows[0].total;
}

module.exports = { findAll, findById, count };
=======
async function count() {
  const { rows } = await db.query(`
        SELECT COUNT(*)::int AS total FROM accounts`);

  return rows[0].total;
}

module.exports = { findAll, count };
>>>>>>> e7b135b (added lesson 2 code)
