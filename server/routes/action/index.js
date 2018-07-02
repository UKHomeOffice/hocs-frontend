const router = require('express').Router();
const actionService = require('../../services/action');
const fileMiddleware = require('../../middleware/file');
const processMiddleware = require('../../middleware/process');
const validationMiddleware = require('../../middleware/validation');
const logger = require('../../libs/logger');

router.post('/:action', fileMiddleware.any(), processMiddleware, validationMiddleware);

router.post('/:action', (req, res) => {
    logger.debug(`Sending form ${JSON.stringify(req.form)}`);

    const {action} = req.params;

    const response = actionService.performAction(action, req.form.data);

    if (res.noScript) {
        return res.redirect(response.callbackUrl);
    }
    res.status(200).send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;