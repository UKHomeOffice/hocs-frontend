const router = require('express').Router();
const { allocateCase, moveByDirection } = require('../../middleware/stage');
const { getFormForAction, getFormForCase, getFormForStage, hydrateFields, getSomuType } = require('../../services/form');
const { skipCaseTypePageApi } = require('../../middleware/skipCaseTypePage');
const { autoCreateAllocateApi } = require('../../middleware/autoCreateAllocate');
const { caseActionDataMiddleware } = require('../../middleware/case');

router.get(['/action/:workflow/:action'],
    skipCaseTypePageApi
);

router.get('/action/:workflow/:context/:action', autoCreateAllocateApi);

router.all(['/action/:workflow/:context/:action', '/action/:workflow/:action'],
    getFormForAction
);

router.all('/case/:caseId/stage/:stageId/allocate', allocateCase);

router.all('/case/:caseId/stage/:stageId/direction/:flowDirection', moveByDirection, (req, res) => {
    res.json({ redirect: `/case/${req.params.caseId}/stage/${req.params.stageId}` });
});
router.all(['/case/:caseId/stage/:stageId', '/case/:caseId/stage/:stageId/allocate'], getFormForStage);

router.get([
    '/case/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction',
    '/case/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction/:caseActionId'
],
caseActionDataMiddleware, getFormForCase, hydrateFields,
(req, res) => res.status(200).send({ ...res.locals.caseActionData, ...req.form }));

router.all([
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:caseType/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/item/:somuItemUuid/:action'
], getFormForCase);
router.all([
    '/action/:workflow/:context/:action/',
    '/action/:workflow/:action/',
    '/case/:caseId/stage/:stageId',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:caseType/:action',
    '/case/:caseId/stage/:stageId/allocate',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/item/:somuItemUuid/:action'
], hydrateFields);
router.get([
    '/action/:workflow/:context/:action/',
    '/action/:workflow/:action/',
    '/case/:caseId/stage/:stageId',
    '/case/:caseId/stage/:stageId/allocate',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:caseType/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/case/:caseId/stage/:stageId/entity/:entity/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/:action',
    '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/item/:somuItemUuid/:action'
], (req, res) => {
    res.status(200).send(req.form);
});

router.get('/somu/somuCaseType/:somuCaseType/somuType/:somuType/',
    getSomuType,
    (req, res) =>
        res.status(200).send(req.somuType)
);

module.exports = router;