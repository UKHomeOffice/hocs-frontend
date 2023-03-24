const router = require('express').Router();
const { getReportList, streamReport } = require('../../middleware/report.js');

router.get('/:caseType/', getReportList);

router.get('/:caseType/:reportSlug', streamReport);

module.exports = router;
