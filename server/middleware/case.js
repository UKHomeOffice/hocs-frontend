const actionService = require('../services/action');
const ErrorModel = require('../models/error');
const logger = require('../libs/logger');
const { caseworkServiceClient } = require('../libs/request');

async function caseResponseMiddleware(req, res, next) {
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
        });
        return next();
    } else {
        if (res.noScript) {
            return res.redirect(callbackUrl);
        }
        return res.status(200).send({ redirect: callbackUrl, response: {} });
    }
}

async function caseSummaryMiddleware(req, res, next) {
    try {
        res.data = {};
        const { caseId } = req.params;
        const response = await caseworkServiceClient.get(`/case/${caseId}`);
        res.data.summary = response.data;
        next();
    } catch (e) {
        logger.error(e.stack);
    }
}

async function caseAjaxResponseMiddleware(req, res) {
    res.send({ ...res.data });
}

module.exports = {
    caseResponseMiddleware,
    caseSummaryMiddleware,
    caseAjaxResponseMiddleware
};