const router = require('express').Router();
const { allocateCase, moveToPreviousStage } = require('../../middleware/stage');
const { getFormForAction, getFormForCase, getFormForStage, hydrateFields } = require('../../services/form');

router.all(['/action/:workflow/:context/:action', '/action/:workflow/:action'],
    getFormForAction
);

router.all('/case/:caseId/stage/:stageId/allocate', allocateCase);

router.all('/case/:caseId/stage/:stageId/back', moveToPreviousStage, (req, res) => {
    res.json({ redirect: `/case/${req.params.caseId}/stage/${req.params.stageId}` });
});
router.all(['/case/:caseId/stage/:stageId', '/case/:caseId/stage/:stageId/allocate'], getFormForStage);
router.all(['/case/:caseId/stage/:stageId/entity/:entity/:context/:action', '/case/:caseId/stage/:stageId/entity/:entity/:action'], getFormForCase);
router.all([
    '/action/:workflow/:context/:action/',
    '/action/:workflow/:action/',
    '/case/:caseId/stage/:stageId',
    '/case/:caseId/stage/:stageId/allocate',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:action',
], hydrateFields);
router.get([
    '/action/:workflow/:context/:action/',
    '/action/:workflow/:action/',
    '/case/:caseId/stage/:stageId',
    '/case/:caseId/stage/:stageId/allocate',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:action'
], (req, res) => {
    res.status(200).send(req.form);
});

module.exports = router;