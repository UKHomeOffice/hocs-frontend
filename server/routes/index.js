const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const authMiddleware = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');
const formService = require('../services/form');

html.use(assets);

router.use('*', authMiddleware);

router.use('/api', apiRouter);

router.use('/action/:action', (req, res, next) => {
    const {action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: formService.getForm('action', {action, user: req.user})
    };
    res.noscript = noScript;
    next();
});

router.use('/case/:type/:action', (req, res, next) => {
    const {type, action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: formService.getForm('workflow', {type, action})
    };
    res.noscript = noScript;
    next();
});

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;