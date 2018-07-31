const actionService = require('../services/action');
const ErrorModel = require('../models/error');

const caseResponseMiddleware = async (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { caseId, entity, action } = req.params;
    const { form, user } = req;
    const response = await actionService.performAction('CASE', { caseId, entity, action, form, user });
    const { error, callbackUrl } = response;
    if (error) {
        res.error = new ErrorModel({
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
};

module.exports = {
    caseResponseMiddleware
};