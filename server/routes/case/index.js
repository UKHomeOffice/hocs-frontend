const router = require('express').Router();
const actionService = require('../../services/action');
const processMiddleware = require('../../middleware/process');
const fileMiddleware = require('../../middleware/file');
const validationMiddleware = require('../../middleware/validation');
const renderMiddleware = require('../../middleware/render');

router.post('/:caseId/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:caseId/:action', (req, res, next) => {
    if (Object.keys(req.form.errors).length > 0) {
        return next();
    }
    const { action, caseId } = req.params;
    const { form, user } = req;
    actionService.performAction(action, { action, form, user, caseId }, (callbackUrl, err) => {
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

router.post('/:caseId/:action', (req, res, next) => {
    if (!res.noScript) {
        return res.status(200).send({ errors: req.form.errors });
    }
    next();
});

router.post('/:caseId/:action', renderMiddleware);

router.post('/:caseId/:action', (req, res) => {
    return res.status(200).send(res.rendered);
});


module.exports = router;