const actionService = require('../services/action');
const ErrorModel = require('../models/error');

async function actionResponseMiddleware(req, res, next) {
    if (Object.keys(req.form.errors).length === 0) {
        const { workflow, context, action } = req.params;
        const { form, user } = req;
        const response = await actionService.performAction('ACTION', { workflow, context, action, form, user });
        const { error, callbackUrl } = response;
        if (error) {
            res.error = new ErrorModel({
                status: 500,
                title: 'Error',
                summary: 'Failed to perform action',
                stackTrace: error.message
            });
        } else if (callbackUrl) {
            return res.redirect(callbackUrl);
        }
    }
    next();
}

async function apiActionResponseMiddleware(req, res) {
    const { workflow, context, action } = req.params;
    const { form, user } = req;
    const response = await actionService.performAction('ACTION', { workflow, context, action, form, user });
    const { error, callbackUrl, confirmation } = response;
    if (error) {
        return res.status(500).json(new ErrorModel({
            status: 500,
            title: 'Error',
            summary: 'Failed to perform action',
            stackTrace: error.message
        }));
    } else if (confirmation) {
        return res.status(200).send({ confirmation });
    } else {
        return res.status(200).send({ redirect: callbackUrl });
    }
}

module.exports = {
    actionResponseMiddleware,
    apiActionResponseMiddleware
};