const router = require('express').Router();
const {getFormForAction, getFormForCase, getFormForStage} = require('../../services/form');
const User = require('../../models/user');

router.use('/action/:action', getFormForAction);

router.use('/case/:type/:action', getFormForCase);

router.use('/case/:caseId/stage/:stageId', getFormForStage);

router.get('/action/:action', (req, res) => {
    const {action} = req.params;
    if (req.user && User.hasRole(req.user, action.toUpperCase())) {
        res.status(200).send(req.form);
    } else {
        res.status(403).send();
    }
});

router.get('/case/:type/:action', (req, res) => {
    res.status(200).send(req.form);
});

router.get('/case/:caseId/stage/:stageId', (req, res) => {
    res.status(200).send(req.form);
});

module.exports = router;