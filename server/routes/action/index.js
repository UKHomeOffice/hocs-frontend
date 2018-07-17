const router = require('express').Router();
const actionService = require('../../services/action');
const fileMiddleware = require('../../middleware/file');
const processMiddleware = require('../../middleware/process');
const validationMiddleware = require('../../middleware/validation');

router.post(['/:workflow/:context/:action', '/:workflow/:action'], fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post(['/:workflow/:context/:action', '/:workflow/:action'], (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { workflow, context, action } = req.params;
    const { form, user } = req;
    actionService.performAction( 'ACTION', { workflow, context, action, form, user }, (callbackUrl, err) => {
        if (err) {
            return res.redirect('/error');
        } else {
            if (res.noScript) {
                return res.redirect(callbackUrl);
            }
            return res.status(200).send({ redirect: callbackUrl, response: {} });
        }
    });
});

module.exports = router;