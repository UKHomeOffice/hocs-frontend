const router = require('express').Router();
const logger = require('../../libs/logger');
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');
const renderMiddleware = require('../../middleware/render');

router.post('/:caseId/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:caseId/:action', (req, res, next) => {
    if (Object.keys(req.form.errors).length === 0) {
        const {action, caseId} = req.params;
        actionService.performAction(action, {form: req.form, user: req.user, caseId}, (callbackUrl, err) => {
            if (err) {
                return res.redirect('/error');
            } else {
                if (res.noScript) {
                    return res.redirect(callbackUrl);
                }
                return res.status(200).send({redirect: callbackUrl, response: {}});
            }
        });
    } else {
        next();
    }
});

router.post('/:caseId/:action', renderMiddleware);

router.post('/:caseId/:action', (req, res) => {
    logger.debug(`Validation errors, returning page: ${JSON.stringify(req.form.errors)}`);
    if (res.noScript) {
        return res.status(200).send(res.rendered);
    }
    res.status(200).send({errors: req.form.errors});
});

module.exports = router;