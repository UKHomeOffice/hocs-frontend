const router = require('express').Router();
const logger = require('../../libs/logger');
const formService = require('../../services/form');
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const validationMiddleware = require('../../middleware/validation');

router.use('/:type/:action', (req, res, next) => {
    const {type, action} = req.params;
    req.form = {
        data: {},
        schema: formService.getForm('workflow', {type, action})
    };
    next();
});

router.get('/:type/:action', (req, res) => {
    const {noScript = false} = req.query;
    if (noScript) {

    } else {
        res.status(200).send(req.form.schema);
    }
});

router.use('/:type/:stage', processMiddleware);

router.use('/:type/:stage', validationMiddleware);

router.post('/:type/:stage', (req, res) => {

    const {noScript = false} = req.query;

    const response = actionService.performAction('submit', req.form.data);

    res.status(200);

    if (noScript) {
        res.redirect(response.callbackUrl);
        return;
    }

    res.send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;