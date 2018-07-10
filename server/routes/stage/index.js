const router = require('express').Router();
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');
const renderMiddleware = require('../../middleware/render');

router.post('/:caseId/stage/:stageId', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:caseId/stage/:stageId', (req, res, next) => {
    if (Object.keys(req.form.errors).length === 0) {
        const { caseId, stageId } = req.params;
        const { form } = req;
        actionService.performAction('workflow', { form, caseId, stageId }, (callbackUrl, err) => {
            if (err) {
                return res.redirect('/error');
            } else {
                if (res.noScript) {
                    return res.redirect(callbackUrl);
                }
                return res.status(200).send({ redirect: callbackUrl, response: {} });
            }
        });
    } else {
        next();
    }
});

router.post('/:caseId/stage/:stageId', (req, res, next) => {
    if (!res.noScript) {
        return res.status(200).send({ errors: req.form.errors });
    }
    next();
});

router.post('/:caseId/stage/:stageId', renderMiddleware);

router.post('/:caseId/stage/:stageId', (req, res) => {
    return res.status(200).send(res.rendered);
});

module.exports = router;