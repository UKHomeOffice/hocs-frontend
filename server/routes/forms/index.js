const router = require('express').Router();
const { getFormForAction, getFormForCase, getFormForStage } = require('../../services/form');
const { protectAction } = require('../../middleware/auth');

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'], getFormForAction, protectAction({ redirect: false }));

router.use('/stage/:stageId/case/:caseId', getFormForStage);

router.use('/case/:type/:entity/:action', getFormForCase);

router.get(['/action/*', '/case/*', '/stage/*'], (req, res) => {
    if (!req.error) {
        res.status(200).send(req.form);
    } else {
        res.status(req.error.errorCode).send(req.error);
    }
});

module.exports = router;