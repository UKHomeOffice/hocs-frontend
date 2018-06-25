const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const authMiddleware = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');
const {getFormForCase, getFormForAction} = require('../services/form');
const User = require('../models/user');

html.use(assets);

router.use('*', authMiddleware);

router.use('/action/:action', (req, res, next) => {
    getFormForAction(req, res, next);
});

router.use('/case/:type/:action', (req, res, next) => {
    getFormForCase(req, res, next);
});

router.use('/api/action/:action', (req, res, next) => {
    getFormForAction(req, res, next);
});

router.use('/api/case/:type/:action', (req, res, next) => {
    getFormForCase(req, res, next);
});

router.get('/api/action/:action', (req, res, next) => {
    const {action} = req.params;
    if (req.user && User.hasRole(req.user, action.toUpperCase())) {
        res.status(200).send(req.form.schema);
    } else {
        res.status(403).send();
    }
});

router.get('/api/case/:type/:action', (req, res) => {
    res.status(200).send(req.form.schema);

});

router.use('/', apiRouter);

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;