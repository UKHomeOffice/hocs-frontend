const router = require('express').Router();
const { getDocumentInfo, getOriginalDocument, getPdfDocument, getPdfDocumentPreview } = require('../middleware/document');

router.get('/:caseId/document/:documentId/preview', getDocumentInfo, getPdfDocumentPreview);

router.get('/:caseId/stage/:stageId/download/document/:documentId/pdf', getDocumentInfo, getPdfDocument);

router.get('/:caseId/stage/:stageId/download/document/:documentId/original', getDocumentInfo, getOriginalDocument);

router.get('/:caseId/stage/:stageId/download/standard_line/:documentId', getOriginalDocument);

module.exports = router;
