const router = require('express').Router();
const { getFormForAction, getFormForCase, getFormForStage } = require('../../services/form');
const { protectAction } = require('../../middleware/auth');

const formResponseMiddleware = (req, res) => {
    if (!res.error) {
        res.status(200).send(req.form);
    } else {
        res.status(res.error.errorCode).send(res.error);
    }
};

router.use(['/action/:workflow/:context/:action', '/action/:workflow/:action'],
    getFormForAction,
    protectAction()
);

router.use('/case/:caseId/stage/:stageId', getFormForStage);

router.use('/case/:caseId/action/:entity/:action', getFormForCase);

router.get(['/action/*', '/case/*', '/stage/*'], formResponseMiddleware);

module.exports = router;