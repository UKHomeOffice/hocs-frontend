const actionService = require('../services/action');
const logger = require('../libs/logger');
const User = require('../models/user');
const { caseworkServiceClient } = require('../libs/request');

async function stageResponseMiddleware(req, res, next) {
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user }, { headers: User.createHeaders(user) });
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
        const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user }, { headers: User.createHeaders(user) });
        const { callbackUrl } = response;
        return res.status(200).json({ redirect: callbackUrl });
    } catch (e) {
        return next(e);
    }
}

async function allocateCase(req, res, next) {
    const { caseId, stageId } = req.params;
    const { user } = req;
    try {
        await caseworkServiceClient.put(`/case/${caseId}/stage/${stageId}/user`, {
            userUUID: user.uuid,
        }, { headers: User.createHeaders(user) });
    } catch (e) {
        logger.warn(e);
    } finally {
        next();
    }
}

async function allocateCaseToTeamMember(req, res, next) {
    const { caseId, stageId } = req.params;
    try {
        await caseworkServiceClient.put(`/case/${caseId}/stage/${stageId}/user`, {
            userUUID: req.body['user-id'],
        }, { headers: User.createHeaders(req.user) });
    } catch (e) {
        logger.warn(e);
    } finally {
        next();
    }
}

module.exports = {
    stageApiResponseMiddleware,
    stageResponseMiddleware,
    allocateCase,
    allocateCaseToTeamMember
};