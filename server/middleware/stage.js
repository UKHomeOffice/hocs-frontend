const actionService = require('../services/action');
const ErrorModel = require('../models/error');
const { workflowServiceClient } = require('../libs/request');

const stageResponseMiddleware = async (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    const response = await actionService.performAction('WORKFLOW', { caseId, stageId, form, user });
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
};

const allocateCase = async (req, res, next) => {
    const { caseId, stageId } = req.params;
    try {
        await workflowServiceClient.post(`/case/${caseId}/stage/${stageId}/allocate`, {
            userUUID: '22222222-2222-2222-2222-222222222222',
            teamUUID: '33333333-3333-3333-3333-333333333333'
        });
        next();
    } catch (error) {
        res.error = new ErrorModel({
            status: 500,
            title: 'Error',
            summary: 'Failed to perform action',
            stackTrace: error.message
        });
        next();
    }

};

module.exports = {
    stageResponseMiddleware,
    allocateCase
};