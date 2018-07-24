const router = require('express').Router();
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation').validator;
const ErrorModel = require('../../models/error');

router.post('/:caseid/stage/:stageId', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:caseId/stage/:stageId', async (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    const response = actionService.performAction('WORKFLOW', { caseId, stageId, form, user });
    const { error, callbackUrl } = response;
    if (error) {
        req.error = new ErrorModel({
            status: 500,
            title: 'Error',
            summary: 'Failed to perform action',
            stackTrace: error.message
        }).toJson();
        return next();
    } else {
        if (res.noScript) {
            return res.redirect(callbackUrl);
        }
        return res.status(200).send({ redirect: callbackUrl, response: {} });
    }
});

module.exports = router;