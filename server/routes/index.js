const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware } = require('../middleware/auth');
const { workstackMiddleware, workstackAjaxResponseMiddleware } = require('../middleware/workstack');
const { errorAjaxResponseMiddleware, errorMiddleware } = require('../middleware/request');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const formRouter = require('./forms/index');
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const stageRouter = require('./stage/index');

html.use(assets);

router.use('*', authMiddleware);

router.get(['/', '/page/workstack'], workstackMiddleware);

router.get('/page/workstack', workstackAjaxResponseMiddleware);

router.use('/action', actionRouter);

router.use('/case', caseRouter);

router.use('/case', stageRouter);

router.post(['/action/*', '/case/*'], errorAjaxResponseMiddleware);

router.use('/forms', formRouter);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;