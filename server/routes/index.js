const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { buildUserModel, protectAction } = require('../middleware/auth');
const renderMiddleware = require('../middleware/render');
const apiRouter = require('./api');
const { getFormForCase, getFormForAction, getFormForStage } = require('../services/form');
const ErrorModel = require('../models/error');

html.use(assets);

router.use('*', buildUserModel);

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'], getFormForAction, protectAction({ redirect: true }));

router.use('/stage/:stageId/case/:caseId', getFormForStage);

router.use('/case/:type/:entity/:action', getFormForCase);

router.use('/', apiRouter);

router.use('*', (err, req, res, next) => {
    req.error = new ErrorModel({
        status: 500,
        title: 'Server Error',
        summary: err.message,
        stackTrace: err.stack
    }).toJson();
    next();
});

router.post(['/action/*', '/case/*', '/stage/*'], (req, res, next) => {
    if (!res.noScript) {
        if (!req.error) {
            return res.status(200).send({ errors: req.form.errors });
        } else {
            return res.status(req.error.errorCode).send(req.error);
        }
    }
    next();
});

router.use('*', renderMiddleware);

router.use('*', (req, res) => {
    return res.status(200).send(res.rendered);
});

module.exports = router;