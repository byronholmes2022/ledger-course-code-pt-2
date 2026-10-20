const { Router } = require("express");
const accountService = require("../services/accountService");

console.log("ACC SERVICE", accountService);
const router = Router();

/**
 * Route layer for accounts.
 *
 * Every handler here:
 * - Reads input from req (params, query, body)
 * - Calls a service function with plain values
 * - Sends the response
 *
 * That's it. If you're writing SQL here, it belongs in the data access
 * layer. If you're writing if-else business rules, it belongs in the
 * service layer. The route handler is a translator between HTTP and
 * your application.
 */

// GET /api/accounts
// http://localhost:3000/api/accounts?limit=3&page=2
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await accountService.listAccounts({ page, limit });
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const account = await accountService.getAccountById(id);
  res.json(account);
});

router.post("/", async (req, res) => {
  const newAcct = await accountService.createAccount(req.body);
  res.status(201).json(newAcct);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await accountService.updateAccount(id, req.body);
  res.send(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = await accountService.deleteAccountById(id);
  res.status(204).send();
});
module.exports = router;
