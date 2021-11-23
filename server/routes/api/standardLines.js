const router = require('express').Router();
const { getAllStandardLines, getOriginalDocument, standardLinesApiResponseMiddleware } = require('../../middleware/standardLine.js');

router.get('/', getAllStandardLines, standardLinesApiResponseMiddleware);

router.get('/download/:documentId', getOriginalDocument);

module.exports = router;