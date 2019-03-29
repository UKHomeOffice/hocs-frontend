const router = require('express').Router();
const { getDocumentList } = require('../middleware/document');
const { getCaseNotes } = require('../middleware/case-notes');
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { caseSummaryMiddleware, createCaseNote, returnToCase } = require('../middleware/case');
const { allocateCase, allocateCaseToTeamMember } = require('../middleware/stage');
const { getFormForCase, getFormForStage, hydrateFields } = require('../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.get('/:caseId/stage/:stageId/allocate/team', allocateCaseToTeamMember, (req, res) => res.redirect(`/case/${req.params.caseId}/stage/${req.params.stageId}`));
router.all(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    hydrateFields,
    caseSummaryMiddleware,
    getDocumentList,
    getCaseNotes);
router.all(['/:caseId/stage/:stageId/entity/:entity/:context/:action', '/:caseId/stage/:stageId/entity/:entity/:action'], getFormForCase, hydrateFields);
router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware
);
router.post('/:caseId/stage/:stageId/note',
    fileMiddleware.any(),
    createCaseNote,
    returnToCase
);

module.exports = router;