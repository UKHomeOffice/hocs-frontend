const router = require('express').Router();
const actionService = require('../../services/action');
const fileMiddleware = require('../../middleware/file');
const processMiddleware = require('../../middleware/process');
const validationMiddleware = require('../../middleware/validation').validator;
const ErrorModel = require('../../models/error');

router.post(['/:workflow/:context/:action', '/:workflow/:action'], fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post(['/:workflow/:context/:action', '/:workflow/:action'], async (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { workflow, context, action } = req.params;
    const { form, user } = req;
    const response = await actionService.performAction('ACTION', { workflow, context, action, form, user });
    const { error, callbackUrl } = response;
    if (error) {
        req.error = new ErrorModel({
            status: 500,
            title: 'Error',
            summary: 'Failed to perform action',
            stackTrace: error.message
        }).toJson();
        return next();
    } else {
        if (res.noScript) {
            return res.redirect(callbackUrl);
        }
        return res.status(200).send({ redirect: callbackUrl, response: {} });
    }
});

module.exports = router;