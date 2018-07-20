const router = require('express').Router();
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation').validator;

router.post('/:stageId/case/:caseId', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:stageId/case/:caseId', (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { caseId, stageId } = req.params;
    const { form, user } = req;
    actionService.performAction('WORKFLOW', { caseId, stageId, form, user }, (callbackUrl, err) => {
        if (err) {
            return res.redirect('/error');
        } else {
            if (res.noScript) {
                return res.redirect(callbackUrl);
            }
            return res.status(200).send({ redirect: callbackUrl, response: {} });
        }
    });
});

module.exports = router;