const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { buildUserModel, protectAction } = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');
const { getFormForCase, getFormForAction, getFormForStage } = require('../services/form');

html.use(assets);

router.use('*', buildUserModel);

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'], getFormForAction, protectAction());

router.use('/stage/:stageId/case/:caseId', getFormForStage);

router.use('/case/:type/:entity/:action', getFormForCase);

router.use('/', apiRouter);

router.use('*', renderMiddleware);

router.use('*', (req, res) => {
    return res.status(200).send(res.rendered);
});

module.exports = router;