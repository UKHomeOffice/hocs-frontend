const router = require('express').Router();
const { apiGetDocumentList } = require('../../middleware/document');

router.get('/:caseId/document/', apiGetDocumentList);

module.exports = router;