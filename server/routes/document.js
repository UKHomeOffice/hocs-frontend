const router = require('express').Router();
const { getDocument } = require('../middleware/document');

router.get('/:caseId/document/:documentId', getDocument);

module.exports = router;