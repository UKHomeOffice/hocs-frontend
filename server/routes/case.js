const router = require('express').Router();
const { getDocumentList } = require('../middleware/document');
const { getCaseNotes } = require('../middleware/case-notes');
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { caseSummaryMiddleware } = require('../middleware/case');
const { allocateCase, allocateCaseToTeamMember } = require('../middleware/stage');
const { getFormForCase, getFormForStage } = require('../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.get('/:caseId/stage/:stageId/allocate/team', allocateCaseToTeamMember, (req, res) => res.redirect(`/case/${req.params.caseId}/stage/${req.params.stageId}`));
router.use(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    caseSummaryMiddleware,
    getDocumentList,
    getCaseNotes);
router.use(['/:caseId/stage/:stageId/entity/:entity/:context/:action', '/:caseId/stage/:stageId/entity/:entity/:action'], getFormForCase);
router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware
);

module.exports = router;