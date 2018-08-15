const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { stageResponseMiddleware, allocateCase } = require('../../middleware/stage');
const { getFormForStage } = require('../../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);

router.use(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'], getFormForStage);

router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    stageResponseMiddleware
);

module.exports = router;