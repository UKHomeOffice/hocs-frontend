const router = require('express').Router();
const formService = require('../../services/form');
const actionService = require('../../services/action');
const User = require('../../models/user');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');

router.use('/:action', (req, res, next) => {
    const {action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: formService.getForm('action', {action, user: req.user}),
        errors: {}
    };
    res.noscript = noScript;
    next();
});

router.get('/:action', (req, res) => {
    const {action} = req.params;
    if (req.user && User.hasRole(req.user, action.toUpperCase())) {
        res.status(200).send(req.form.schema);
    } else {
        // TODO: Just send 403 if AJAX call?
        res.redirect('/unauthorised');
    }
});

router.post('/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:action', (req, res) => {

    const {action} = req.params;
    const {noScript = false} = req.query;

    const response = actionService.performAction(action, req.form.data);

    res.status(200);

    if (noScript) {
        res.redirect(response.callbackUrl);
        return;
    }

    res.send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;