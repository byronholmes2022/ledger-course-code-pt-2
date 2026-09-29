/**
 * Wraps an async route handler to catch errors and pass them to next().
 *
 * Without this, you'd need try-catch in every single route handler:
 *
 *   router.get('/', async (req, res, next) => {
 *     try {
 *       const accounts = await accountService.listAccounts();
 *       res.json(accounts);
 *     } catch (err) {
 *       next(err);
 *     }
 *   });
 *
 * With this:
 *
 *   router.get('/', asyncHandler(async (req, res) => {
 *     const accounts = await accountService.listAccounts();
 *     res.json(accounts);
 *   }));
 *
 * Same behavior, less boilerplate, and — critically — no chance of
 * forgetting the try-catch in one handler and creating a silent failure.
 */

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
