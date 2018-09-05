const router = require('express').Router();
const { getFormForAction } = require('../../services/form');
const authMiddleware = require('../../middleware/auth');
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { apiActionResponseMiddleware } = require('../../middleware/action');

router.post(['/:workflow/:context/:action', '/:workflow/:action'],
    getFormForAction,
    authMiddleware.protectAction(),
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    apiActionResponseMiddleware
);

module.exports = router;