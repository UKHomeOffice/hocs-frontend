const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware, apiValidationResponseMiddleware } = require('../../middleware/validation');
const { apiStageResponseMiddleware, allocateCase } = require('../../middleware/stage');
const { caseSummaryMiddleware, caseAjaxResponseMiddleware } = require('../../middleware/case');
const { getFormForStage } = require('../../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    apiValidationResponseMiddleware,
    apiStageResponseMiddleware
);
router.get('/:caseId/summary', caseSummaryMiddleware, caseAjaxResponseMiddleware);

module.exports = router;