const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { actionResponseMiddleware } = require('../../middleware/action');
const authMiddleware = require('../../middleware/auth');
const { getFormForAction } = require('../../services/form');

router.use(['/:workflow/:context/:action', '/:workflow/:action'],
    getFormForAction,
    authMiddleware.protectAction()
);

router.post(['/:workflow/:context/:action', '/:workflow/:action'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    actionResponseMiddleware
);

module.exports = router;