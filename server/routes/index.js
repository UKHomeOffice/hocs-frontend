const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware } = require('../middleware/auth');
const apiRouter = require('./api/index');
const pageRouter = require('./page');
const actionRouter = require('./action');
const caseRouter = require('./case');
const documentRouter = require('./document');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');

html.use(assets);

router.use('*', authMiddleware, initRequest);
router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;