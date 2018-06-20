const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const renderMiddleware = require('../middleware/render');
const authMiddleware = require('../middleware/auth');
const formService = require('../services/form');
const logger = require('../libs/logger');

html.use(assets);

router.use('*', authMiddleware);

router.use('/', (req, res, next) => {
    next();
});

router.use('/case/:type/:stage', (req, res, next) => {
    // get appropriate form and case data
    // add to locals for use by renderer
    const {type, stage} = req.params;
    logger.info(`TYPE = ${type}`);
    res.locals.form = formService.getForm(type);
    next();
});

router.use('/action/:action', (req, res, next) => {
    res.locals.form = formService.getForm('create');
    logger.info(`ACTION = ${req.params.action}`);
    next();
});

router.use('/action/:action/:id', (req, res, next) => {
    // get appropriate form
    // add to locals for use by renderer
    const {action, stage} = req.params;
    logger.info(`TYPE = ${type}`);
    res.locals.form = formService.getForm(action);
    next();
});

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;