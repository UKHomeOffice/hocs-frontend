const router = require('express').Router();
const cookieParser = require('cookie-parser');
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { sessionExpiryMiddleware, handleTokenRefresh } = require('../middleware/auth');
const apiRouter = require('./api/index');
const pageRouter = require('./page');
const actionRouter = require('./action');
const caseRouter = require('./case');
const documentRouter = require('./document');
const templatesRouter = require('./templates');
const healthRouter = require('./health');
const search = require('./search');
const dashboard = require('./dashboard');
const auth = require('./auth');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { setCacheControl } = require('../middleware/cacheControl');
const { csrfMiddleware } = require('../middleware/csrf');
const { infoService } = require('../clients');
const logger = require('../libs/logger');
const { flush } = require('../services/list');

html.use(assets);

router.use(cookieParser());
router.use(csrfMiddleware);
router.use('/health', healthRouter);
router.use('/', auth);

router.use('*',
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        return next();
    },
    handleTokenRefresh,
    sessionExpiryMiddleware,
    initRequest,
    setCacheControl
);

router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);
router.use('/case', templatesRouter);
router.use('/', dashboard);
router.use('/', search);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoService.get('/admin/member/refresh');
            logger(req.requestId).info('REFRESH_MEMBERS', { user: req.user.email });
            res.status(200).send();
        } catch (error) {
            return next(error);
        }
    }
);

router.get('/admin/list/flush',
    protect('SYS_ADMIN'),
    (req, res, next) => {
        try {
            logger(req.requestId).info('FLUSH_CACHE', { user: req.user.email });
            flush('S_USERS');
            res.status(200).send();
        } catch (error) {
            return next(error);
        }
    }
);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;
