const { Router } = require("express");
const accountService = require("../services/accountService");
const asyncHandler = require("../utils/asyncHandler");

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
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await accountService.listAccounts({ page, limit });
    res.json(result);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const account = await accountService.getAccountById(id);
    res.json(account);
  }),
);

module.exports = router;
