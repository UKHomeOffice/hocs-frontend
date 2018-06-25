const router = require('express').Router();
const logger = require('../../libs/logger');
const formService = require('../../services/form');
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');
const renderMiddleware = require('../../middleware/render');

router.use('/:type/:action', (req, res, next) => {
    const {type, action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: formService.getForm('workflow', {type, action}),
        errors: {}
    };
    res.noscript = noScript;
    next();
});

router.get('/:type/:action', (req, res) => {
    const {noScript = false} = req.query;
    if (noScript) {

    } else {
        res.status(200).send(req.form.schema);
    }
});

router.post('/:type/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:type/:action', (req, res, next) => {

    const {noScript = false} = req.query;

    if(Object.keys(req.form.errors).length === 0) {
        const response = actionService.performAction('submit', req.form.data);
        res.status(200);
        if (noScript) {
            return res.redirect(response.callbackUrl);
        }
        return res.send({redirect: response.callbackUrl, response: {}});
    }
    next();
});

router.post('/:type/:action', renderMiddleware);

router.post('/:type/:action', (req, res) => {
    if (res.noscript) {
        return res.send(res.rendered);
    }
    res.send({errors: req.form.errors});
});

module.exports = router;