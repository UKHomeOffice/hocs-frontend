const actionService = require('../services/action');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const { caseworkService } = require('../clients');

async function stageResponseMiddleware(req, res, next) {
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    try {
        const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user }, { headers: User.createHeaders(user) });
        const { callbackUrl } = response;
        return res.redirect(callbackUrl);
    } catch (error) {
        return next(error);
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
    } catch (error) {
        return next(error);
    }
}

async function allocateCase(req, res, next) {
    const logger = getLogger(req.request);
    const { caseId, stageId } = req.params;
    const { user } = req;
    try {
        await caseworkService.put(`/case/${caseId}/stage/${stageId}/user`, {
            userUUID: user.uuid,
        }, { headers: User.createHeaders(user) });
    } catch (error) {
        logger.error(error);
    } finally {
        next();
    }
}

async function allocateCaseToTeamMember(req, res, next) {
    const logger = getLogger(req.request);
    const { caseId, stageId } = req.params;
    try {
        await caseworkService.put(`/case/${caseId}/stage/${stageId}/user`, {
            userUUID: req.body['user-id'],
        }, { headers: User.createHeaders(req.user) });
    } catch (error) {
        logger.error(error);
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