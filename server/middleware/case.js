const actionService = require('../services/action');
const logger = require('../libs/logger');
const { caseworkServiceClient } = require('../libs/request');

async function caseResponseMiddleware(req, res, next) {
    const { caseId, stageId, entity, context, action } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('CASE', { caseId, stageId, entity, context, action, form, user });
        const { callbackUrl } = response;
        return res.redirect(callbackUrl);
    } catch (e) {
        return next(e);
    } finally {
        next();
    }
}

async function caseApiResponseMiddleware(req, res, next) {
    const { caseId, stageId, entity, context, action } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('CASE', { caseId, stageId, entity, context, action, form, user });
        const { callbackUrl } = response;
        return res.status(200).json({ redirect: callbackUrl });
    } catch (e) {
        return next(e);
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

async function caseSummaryApiResponseMiddleware(req, res) {
    res.send({ ...res.data });
}

module.exports = {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware
};