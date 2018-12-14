const router = require('express').Router();
const { getDocumentList } = require('../middleware/document');
const { getCaseNotes } = require('../middleware/case-notes');
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { caseSummaryMiddleware } = require('../middleware/case');
const { allocateCase } = require('../middleware/stage');
const { getFormForCase, getFormForStage } = require('../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
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