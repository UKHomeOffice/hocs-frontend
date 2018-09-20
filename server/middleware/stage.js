const actionService = require('../services/action');
const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

async function stageResponseMiddleware(req, res, next) {
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user });
        const { callbackUrl } = response;
        return res.redirect(callbackUrl);
    } catch (e) {
        return next(e);
    } finally {
        next();
    }
}

async function stageApiResponseMiddleware(req, res, next) {
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user });
        const { callbackUrl } = response;
        return res.status(200).json({ redirect: callbackUrl });
    } catch (e) {
        return next(e);
    }
}

async function allocateCase(req, res, next) {
    const { caseId, stageId } = req.params;
    try {
        await workflowServiceClient.post(`/case/${caseId}/stage/${stageId}/allocate`, {
            userUUID: '22222222-2222-2222-2222-222222222222',
            teamUUID: '33333333-3333-3333-3333-333333333333'
        });
    } catch (e) {
        logger.warn(e);
    } finally {
        next();
    }
}

module.exports = {
    stageApiResponseMiddleware,
    stageResponseMiddleware,
    allocateCase
};