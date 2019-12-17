const router = require('express').Router();
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/process');
const { validationMiddleware } = require('../middleware/validation');
const { actionResponseMiddleware } = require('../middleware/action');
const { getFormForAction, hydrateFields } = require('../services/form');
const { skipCaseTypePage } = require('../middleware/skipCaseTypePage');
const { autoCreateAllocateBrowser } = require('../middleware/autoCreateAllocate');

router.get(['/:workflow/:action'],
    skipCaseTypePage
);

router.get('/:workflow/:context/:action', autoCreateAllocateBrowser);

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
