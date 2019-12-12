const router = require('express').Router();
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { actionResponseMiddleware } = require('../middleware/action');
const { getFormForAction, hydrateFields } = require('../services/form');
const { skipCaseTypePage } = require('../middleware/skipCaseTypePage');

router.get(['/:workflow/:action'],
    skipCaseTypePage
);

router.use(['/:workflow/:context/:action', '/:workflow/:action'],
    getFormForAction,
    hydrateFields
);

router.post(['/:workflow/:context/:action', '/:workflow/:action'],
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    actionResponseMiddleware
);

module.exports = router;