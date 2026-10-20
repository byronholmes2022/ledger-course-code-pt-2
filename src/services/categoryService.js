const categoryDb = require("../db/categories");

async function listCategories() {
  return categoryDb.findAll();
}

async function getCategoryById(id) {
  const category = await categoryDb.findById(id);
  if (!category) {
    const error = new Error(`Category with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return category;
}

async function createCategory(data) {
  return categoryDb.create(data);
}

async function updateCategory(id, data) {
  const category = await categoryDb.updateById(id, data);
  if (!category) {
    const error = new Error(`Category with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return category;
}

async function deleteCategory(id) {
  const category = await categoryDb.deleteById(id);
  if (!category) {
    const error = new Error(`Category with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return category;
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
