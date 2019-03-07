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
const search = require('./search');
const dashboard = require('./dashboard');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { createAnalyticsObject } = require('../middleware/analytics');
const { infoServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { flushCachedLists } = require('../services/list');

html.use(assets);

router.use('/health', healthRouter);
router.use('*', authMiddleware, initRequest, createAnalyticsObject);
router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);
router.use('/', dashboard);
router.use('/', search);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoServiceClient.get('/admin/member/refresh');
            logger.info('request to update members in info service');
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
);

router.get('/admin/list/flush',
    protect('SYS_ADMIN'),
    (req, res, next) => {
        try {
            logger.info({ event: 'LIST_SERVICE_FLUSH_CACHE', user: req.user.username });
            flushCachedLists();
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;