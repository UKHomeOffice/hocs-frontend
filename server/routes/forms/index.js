const router = require('express').Router();
const { getFormForAction, getFormForCase, getFormForStage } = require('../../services/form');
const { protectAction } = require('../../middleware/auth');

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'], getFormForAction, protectAction({ redirect: false }));

router.get(['/action/:workflow/:context/:action', '/action/:workflow/:action'], (req, res) => {
    res.status(200).send(req.form);
});

router.use('/stage/:stageId/case/:caseId', getFormForStage);

router.use('/case/:type/:entity/:action', getFormForCase);

router.get(['/case/*', '/stage/*'], (req, res) => {
    res.status(200).send(req.form);
});

module.exports = router;