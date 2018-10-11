const actionService = require('../services/action');

async function actionResponseMiddleware(req, res, next) {
    const { workflow, context, action } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('ACTION', { workflow, context, action, form, user });
        const { callbackUrl, confirmation } = response;
        if (confirmation) {
            res.locals.confirmation = confirmation;
        }
        if (callbackUrl) {
            return res.redirect(callbackUrl);
        }
        next();
    } catch (e) {
        return next(e);
    }
}

async function apiActionResponseMiddleware(req, res, next) {
    const { workflow, context, action } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('ACTION', { workflow, context, action, form, user });
        const { callbackUrl, confirmation } = response;
        if (confirmation) {
            return res.status(200).json({ confirmation });
        } else {
            return res.status(200).json({ redirect: callbackUrl });
        }
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    actionResponseMiddleware,
    apiActionResponseMiddleware
};