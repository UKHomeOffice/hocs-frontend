const router = require('express').Router();
const assets = require('../../build/assets.json');
const formService = require('../services/form');
const html = require('../layout/html');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');

html.use(assets);

router.use('*', authMiddleware);

router.use('/api', apiRouter);

router.use('/case/:type/:action', (req, res, next) => {
    const {type, action} = req.params;
    res.locals.form = formService.getForm('workflow', {type, action});
    next();
});

router.use('/action/:action', (req, res, next) => {
    const {action} = req.params;
    if (req.user && User.hasRole(req.user, action.toUpperCase())) {
        res.locals.form = formService.getForm('action', {action, user: req.user});
        next();
    } else {
        res.redirect('/unauthorised');
    }
});

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;