const actionService = require('../services/action');
const { caseworkServiceClient } = require('../libs/request');
const User = require('../models/user');
const { getList } = require('../services/list');

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
        const summary = await getList('CASE_SUMMARY', { ...req.params, user: req.user });
        res.locals.summary = summary;
        next();
    } catch (e) {
        next(e);
    }
}

function caseSummaryApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.summary);
}

async function createCaseNote(req, res, next) {
    try {
        if (!req.body.caseNote) {
            res.locals.error = 'Case note must not be blank';
            next();
        }
        await caseworkServiceClient.post(`/case/${req.params.caseId}/note`, {
            text: req.body.caseNote,
            type: 'MANUAL'
        }, { headers: User.createHeaders(req.user) });
    } catch (error) {
        next(new Error(`Failed to attach case note to case ${req.params.caseId} `));
    }
    next();
}

function returnToCase(req, res) {
    res.redirect(`/case/${req.params.caseId}/stage/${req.params.stageId}`);
}

module.exports = {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware,
    createCaseNote,
    returnToCase
};