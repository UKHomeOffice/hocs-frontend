const router = require('express').Router();
const { getDocumentList } = require('../middleware/document');
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { caseSummaryMiddleware } = require('../middleware/case');
const { allocateCase } = require('../middleware/stage');
const { protect } = require('../middleware/auth');
const { getFormForCase, getFormForStage } = require('../services/form');

router.get('/:caseId/summary', caseSummaryMiddleware);
router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.use(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    getDocumentList);
router.use(['/:caseId/stage/:stageId/entity/document/:context/:action', '/:caseId/stage/:stageId/entity/document/:action'], protect('MANAGE_DOCUMENTS'));
router.use(['/:caseId/stage/:stageId/entity/:entity/:context/:action', '/:caseId/stage/:stageId/entity/:entity/:action'], getFormForCase);
router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware
);

module.exports = router;