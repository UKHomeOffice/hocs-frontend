const router = require('express').Router();
const { getOverview, overviewApiResponseMiddleware,caseTypeApiResponseMiddleware,
    getCaseTypes } = require('../../middleware/overview');

router.get('/', getOverview, overviewApiResponseMiddleware);
router.get('/caseTypes', getCaseTypes, caseTypeApiResponseMiddleware);

module.exports = router;
