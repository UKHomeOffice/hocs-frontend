const router = require('express').Router();
const { getOriginalDocument, getPdfDocument, getPdfDocumentPreview } = require('../middleware/document');

router.get('/:caseId/document/:documentId/preview', getPdfDocumentPreview);

router.get('/:caseId/stage/:stageId/download/document/:documentId/pdf', getPdfDocument);

router.get('/:caseId/stage/:stageId/download/document/:documentId/original', getOriginalDocument);

router.get('/:caseId/stage/:stageId/download/standard_line/:documentId', getOriginalDocument);

module.exports = router;