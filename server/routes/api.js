const router = require('express').Router();
const actionService = require('../services/action');
const formService = require('../services/form');
const validationMiddleware = require('../middleware/validation');
const processMiddleware = require('../middleware/process');
const authMiddleware = require('../middleware/auth');
const logger = require('../libs/logger');


router.use('*', authMiddleware);

router.get('/action/:type', (req, res) => {
    const {type} = req.params;
    logger.info(`Getting form for action type: ${type}`);
    const form = formService.getForm(type);
    res.status(200).send(form);
});

router.get('/case/:type/:stage/:id', (req, res) => {
    const {type, stage, id} = req.params;
    logger.info(`Getting form for action type: ${type}`);
    const form = formService.getForm(type);
    res.status(200).send(form);
});

router.use('/*', processMiddleware);

router.use('/*', validationMiddleware);

router.use('/case/:type/:stage/:id', (req, res, next) => {
    // get appropriate form and case data
    // add to response body to be returned to client
    next();
});

router.use('/action/:type/:id', (req, res, next) => {
    // get appropriate form
    // add to response body to be returned to client
    next();
});

router.post('/action/:action', (req, res) => {

    const {action} = req.params;
    const {noScript = false} = req.query;

    const response = actionService.performAction(action, req.form.data);

    res.status(200);

    if (noScript) {
        res.redirect(response.callbackUrl);
        return;
    }

    res.send({redirect: response.callbackUrl, response: {}});
});

router.post('/case/:type/:stage/:id', (req, res) => {

    const {noScript = false} = req.query;

    const response = actionService.performAction('submit', req.form.data);

    res.status(200);

    if (noScript) {
        res.redirect(response.callbackUrl);
        return;
    }

    res.send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;