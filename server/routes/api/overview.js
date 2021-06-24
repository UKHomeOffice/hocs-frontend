const router = require('express').Router();
const { getOverview, overviewApiResponseMiddleware } = require('../../middleware/overview');

router.get('/', getOverview, overviewApiResponseMiddleware);

module.exports = router;
