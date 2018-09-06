const router = require('express').Router();
const { allocateCase } = require('../../middleware/stage');
const { getFormForAction, getFormForStage } = require('../../services/form');
const { protectAction } = require('../../middleware/auth');

// TODO: GET RID OF THIS!
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
router.use('/case/:caseId/stage/:stageId/allocate', allocateCase);
router.use(['/case/:caseId/stage/:stageId', '/case/:caseId/stage/:stageId/allocate'], getFormForStage);
router.get(['/action/*', '/case/*'], formResponseMiddleware);

module.exports = router;