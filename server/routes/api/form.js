const router = require('express').Router();
const { allocateCase } = require('../../middleware/stage');
const { getFormForAction, getFormForCase, getFormForStage } = require('../../services/form');

router.all(['/action/:workflow/:context/:action', '/action/:workflow/:action'],
    getFormForAction
);

router.all('/case/:caseId/stage/:stageId/allocate', allocateCase);
router.all(['/case/:caseId/stage/:stageId', '/case/:caseId/stage/:stageId/allocate'], getFormForStage);
router.all(['/case/:caseId/stage/:stageId/entity/:entity/:context/:action','/case/:caseId/stage/:stageId/entity/:entity/:action'], getFormForCase);
router.get(['/action/*', '/case/*'], (req, res) => {
    res.status(200).send(req.form);
});

module.exports = router;