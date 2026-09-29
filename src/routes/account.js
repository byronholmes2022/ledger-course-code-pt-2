const { Router } = require("express");
const { listAccounts } = require("../services/accountService");

const router = Router();

// GET /accounts
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await listAccounts({ page, limit });
  res.json(result);
});

module.exports = router;
