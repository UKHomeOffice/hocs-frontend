const router = require('express').Router();
const { fileMiddleware } = require('../middleware/file');
const { processMiddleware } = require('../middleware/form/process');
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
    actionResponseMiddleware
);

module.exports = router;
