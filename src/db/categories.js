const db = require("./index");
const handlePgError = require("../utils/pgErrors");

// Columns a client is allowed to change via updateById.
const UPDATABLE = ["name", "description"];

async function findAll() {
  const { rows } = await db.query("SELECT * FROM categories ORDER BY name ASC");
  return rows;
}

async function findById(id) {
  const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ]);
  return rows[0] || null;
}

async function create({ name, description }) {
  return handlePgError(
    async () => {
      const { rows } = await db.query(
        `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
        [name, description || null],
      );
      return rows[0];
    },
    {
      uniqueColumns: { name: `A category name "${name}" already exists"` },
    },
  );
}

async function updateById(id, fields) {
  const cols = UPDATABLE.filter((col) => Object.hasOwn(fields, col));
  if (cols.length === 0) return findById(id);

  const values = cols.map((col) => fields[col]);
  const setClauses = cols.map((col, i) => `${col} = $${i + 1}`);
  setClauses.push("updated_at = now()");
  values.push(id);

  const { rows } = await db.query(
    `UPDATE categories SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );
  return rows[0] || null;
}

async function deleteById(id) {
  const { rows } = await db.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
