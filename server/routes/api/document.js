const router = require('express').Router();
const { getDocumentList, apiGetDocumentList } = require('../../middleware/document');
const { getCaseNotes, getCaseNotesApiResponse } = require('../../middleware/case-notes');

router.get('/:caseId/document/', getDocumentList, apiGetDocumentList);

router.get('/:caseId/caseNotes/', getCaseNotes, getCaseNotesApiResponse);

module.exports = router;