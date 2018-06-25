const router = require('express').Router();
const {getFormForAction} = require('../../services/form');
const actionService = require('../../services/action');
const User = require('../../models/user');
const fileMiddleware = require('../../middleware/file');
const processMiddleware = require('../../middleware/process');
const validationMiddleware = require('../../middleware/validation');
const logger = require('../../libs/logger');

router.use('/:action', (req, res, next) => {
    getFormForAction(req, res, next);
});

router.get('/:action', (req, res, next) => {
    const {action} = req.params;
    if (res.noScript) {
        next();
    } else {
        if (req.user && User.hasRole(req.user, action.toUpperCase())) {
            res.status(200).send(req.form.schema);
        } else {
            res.status(403).send();
        }
    }
});

router.post('/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:action', (req, res) => {
    logger.debug(`Sending form ${JSON.stringify(req.form)}`);

    const {action} = req.params;

    const response = actionService.performAction(action, req.form.data);

    if (res.noScript) {
        return res.redirect(response.callbackUrl);
    }
    res.status(200).send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;