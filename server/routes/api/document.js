const router = require('express').Router();
const { apiGetDocumentList, getDocument } = require('../../middleware/document');

router.get('/:caseId/document/', apiGetDocumentList);
router.get('/:caseId/document/:documentId', getDocument);

module.exports = router;