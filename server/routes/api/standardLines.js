const router = require('express').Router();
const { getUsersStandardLines, getOriginalDocument, standardLinesApiResponseMiddleware } = require('../../middleware/standardLine.js');

router.get('/', getUsersStandardLines, standardLinesApiResponseMiddleware);

router.get('/download/:documentId', getOriginalDocument);

module.exports = router;