const router = require('express').Router();
const { getDocumentList, apiGetDocumentList } = require('../../middleware/document');

router.get('/:caseId/document/', getDocumentList, apiGetDocumentList);

module.exports = router;