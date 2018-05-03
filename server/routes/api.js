const router = require('express').Router();
const caseModel = require('../models/case');

router.post('/case/:action', (req, res) => {

    const {action} = req.params;
    const {noScript = false} = req.query;
    let status = 200;
    let redirectUrl = `/case/${action}`;

    caseModel.create(action, req.body, (err, data) => {
        if(err) {
            status = 500;
            redirectUrl = '/error';
        }
        res.status(status);
        if(noScript) {
            res.redirect(redirectUrl);
            return;
        }
        res.send({redirect: redirectUrl, response: data});
    });

});

module.exports = router;