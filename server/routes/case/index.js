const router = require('express').Router();
const logger = require('../../libs/logger');
const {getFormForCase} = require('../../services/form');
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');
const renderMiddleware = require('../../middleware/render');

router.use('/:type/:action', (req, res, next) => {
    getFormForCase(req, res, next);
});

router.get('/:type/:action', (req, res, next) => {
    if (res.noScript) {
        next();
    } else {
        res.status(200).send(req.form.schema);
    }
});

router.post('/:type/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:type/:action', (req, res, next) => {
    logger.debug(`Sending form ${JSON.stringify(req.form)}`);
    if (Object.keys(req.form.errors).length === 0) {
        const response = actionService.performAction(req.params.action, req.form.data);
        if (res.noScript) {
            return res.redirect(response.callbackUrl);
        }
        return res.status(200).send({redirect: response.callbackUrl, response: {}});
    }
    next();
});

router.post('/:type/:action', renderMiddleware);

router.post('/:type/:action', (req, res) => {
    logger.debug(`Validation errors, returning page: ${JSON.stringify(req.form.errors)}`);
    if (res.noScript) {
        return res.status(200).send(res.rendered);
    }
    res.status(200).send({errors: req.form.errors});
});

module.exports = router;