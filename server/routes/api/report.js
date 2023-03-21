const router = require('express').Router();
const { getReportList, streamReport, getReportMetadata } = require('../../middleware/report.js');

router.get('/', getReportList);

router.get('/:reportSlug', streamReport);

router.get('/:reportSlug/metadata', getReportMetadata);

module.exports = router;
