const { Router } = require("express");
const categoryService = require("../services/categoryService");

const router = Router();

// GET /api/categories
router.get("/", async (req, res) => {
  const categories = await categoryService.listCategories();
  res.json(categories);
});

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const category = await categoryService.getCategoryById(id);
  res.json(category);
});

// POST /api/categories
router.post("/", async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
});

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const category = await categoryService.updateCategory(id, req.body);
  res.json(category);
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await categoryService.deleteCategory(id);
  res.status(204).send();
});

module.exports = router;
