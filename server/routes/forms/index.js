const router = require('express').Router();
const { getFormForAction, getFormForCase, getFormForStage } = require('../../services/form');
const User = require('../../models/user');

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'], getFormForAction);

router.get(['/action/:workflow/:context/:action', '/action/:workflow/:action'], (req, res) => {
    const { workflow } = req.params;
    if (req.user && User.hasRole(req.user, workflow.toUpperCase())) {
        res.status(200).send(req.form);
    } else {
        res.status(403).send();
    }
});

router.use('/stage/:stageId/case/:caseId', getFormForStage);

router.use('/case/:type/:entity/:action', getFormForCase);

router.get(['/case/*', '/stage/*'], (req, res) => {
    res.status(200).send(req.form);
});

module.exports = router;