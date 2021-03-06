const actionService = require('../services/action');
const { caseworkService } = require('../clients');
const User = require('../models/user');

async function caseResponseMiddleware(req, res, next) {
    const { form, user } = req;
    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, user });
        return res.redirect(callbackUrl);
    } catch (error) {
        return next(error);
    }
}

async function caseApiResponseMiddleware(req, res, next) {
    const { form, user } = req;
    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, user });
        return res.status(200).json({ redirect: callbackUrl });
    } catch (error) {
        next(error);
    }
}

async function caseSummaryMiddleware(req, res, next) {
    try {
        const summary = await req.listService.fetch('CASE_SUMMARY', req.params);
        res.locals.summary = summary;
        next();
    } catch (error) {
        next(error);
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
        await caseworkService.post(`/case/${req.params.caseId}/note`, {
            text: req.body.caseNote,
            type: 'MANUAL'
        }, { headers: User.createHeaders(req.user) });
    } catch (error) {
        next(new Error(`Failed to attach case note to case ${req.params.caseId} `));
    }
    next();
}

async function updateCaseNote({ body: { caseNote }, params: { caseId, noteId }, user }, res, next) {
    try {
        if (!caseNote) {
            res.locals.error = 'Case note must not be blank';
            return next();
        }
        const updated = await caseworkService.put(`/case/${caseId}/note/${noteId}`, {
            text: caseNote,
            type: 'MANUAL'
        }, { headers: User.createHeaders(user) });
        res.locals.caseNote = updated.data;
    } catch (error) {
        return next(new Error(`Failed to update case note ${noteId} on case ${caseId} `));
    }
    return next();
}

function returnToCase(req, res) {
    res.redirect(`/case/${req.params.caseId}/stage/${req.params.stageId}`);
}

async function caseCorrespondentsMiddleware(req, res, next) {
    try {
        res.locals.correspondents = await req.listService.fetch('CASE_CORRESPONDENTS_ALL', req.params);
        next();
    } catch (error) {
        next(error);
    }
}

function caseCorrespondentsApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.correspondents);
}

module.exports = {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware,
    createCaseNote,
    returnToCase,
    updateCaseNote,
    caseCorrespondentsMiddleware,
    caseCorrespondentsApiResponseMiddleware
};