const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const authMiddleware = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');
const {getFormForCase, getFormForAction} = require('../services/form');

html.use(assets);

router.use('*', authMiddleware);

router.use('/api', apiRouter);

router.use('/action/:action', (req, res, next) => {
    getFormForAction(req, res, next);
});

router.use('/case/:type/:action', (req, res, next) => {
    getFormForCase(req, res, next);
});

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;