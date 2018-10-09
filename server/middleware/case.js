const actionService = require('../services/action');
const { caseworkServiceClient } = require('../libs/request');

async function caseResponseMiddleware(req, res, next) {
    const { form, user } = req;
    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, user });
        return res.redirect(callbackUrl);
    } catch (e) {
        return next(e);
    }
}

async function caseApiResponseMiddleware(req, res, next) {
    const { form, user } = req;
    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, user });
        return res.status(200).json({ redirect: callbackUrl });
    } catch (e) {
        next(e);
    }
}

async function caseSummaryMiddleware(req, res, next) {
    try {
        const { caseId } = req.params;
        const response = await caseworkServiceClient.get(`/case/${caseId}`);
        res.locals.summary = response.data;
        next();
    } catch (e) {
        next(e);
    }
}

function caseSummaryApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.summary);
}

module.exports = {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware
};