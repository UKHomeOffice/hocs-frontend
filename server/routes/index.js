const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware } = require('../middleware/auth');
const apiRouter = require('./api/index');
const pageRouter = require('./page');
const actionRouter = require('./action');
const caseRouter = require('./case');
const documentRouter = require('./document');
const healthRouter = require('./health');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { infoServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

html.use(assets);

router.use('/health', healthRouter);
router.use('*', authMiddleware, initRequest);
router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoServiceClient.get('/members/refresh');
            logger.info('request to update members in info service');
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;