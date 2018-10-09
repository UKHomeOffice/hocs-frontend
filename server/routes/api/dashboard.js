const router = require('express').Router();
const { dashboardMiddleware, dashboardApiResponseMiddleware } = require('../../middleware/dashboard');

router.get('/', dashboardMiddleware, dashboardApiResponseMiddleware);

module.exports = router;