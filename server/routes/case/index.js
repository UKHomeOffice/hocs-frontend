const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { caseResponseMiddleware } = require('../../middleware/case');
const { getFormForCase } = require('../../services/form');

router.use('/:caseId/action/:entity/:action', getFormForCase);

router.post('/:caseId/action/:entity/:action',
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    caseResponseMiddleware
);

module.exports = router;