const actionService = require('../services/action');
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
        const summary = await getList('CASE_SUMMARY', { ...req.params, user: req.user })
        res.locals.summary = summary;
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