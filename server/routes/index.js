const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const authMiddleware = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const formsRouter = require('./forms');
const { getFormForCase, getFormForAction, getFormForStage } = require('../services/form');

html.use(assets);

router.use('*', authMiddleware);

router.use(['/action/:context/:action', '/action/:action'], getFormForAction);

router.use('/case/:type/:action', getFormForCase);

router.use('/case/:caseId/stage/:stageId', getFormForStage);

router.use('/', formsRouter);

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;