const router = require('express').Router();
const actionModel = require('../models/action');
const validationMiddleware = require('../middleware/validation');
const processMiddleware = require('../middleware/process');
const authMiddleware = require('../middleware/auth');

router.use('*', authMiddleware);

router.use('/case/*', processMiddleware);

router.use('/case/*', validationMiddleware);

router.post('/case/:action', (req, res) => {
    console.log(req.form);

    const {action} = req.params;
    const {noScript = false} = req.query;

    const response = actionModel.performAction(action, req.form.data);

    res.status(200);

    if (noScript) {
        res.redirect(response.callbackUrl);
        return;
    }

    res.send({redirect: response.callbackUrl, response: {}});
});

module.exports = router;