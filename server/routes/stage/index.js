const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { stageResponseMiddleware } = require('../../middleware/stage');
const { getFormForStage } = require('../../services/form');

router.use('/:caseId/stage/:stageId', getFormForStage);

router.post('/:caseId/stage/:stageId',
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    stageResponseMiddleware
);

module.exports = router;