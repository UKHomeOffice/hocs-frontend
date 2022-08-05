const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/form/process');
const { protect } = require('../../middleware/auth');
const { stageApiResponseMiddleware, allocateCase, allocateCaseToTeamMember } = require('../../middleware/stage');
const {
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware,
    caseApiResponseMiddleware,
    createCaseNote,
    updateCaseNote,
    caseCorrespondentsMiddleware,
    caseCorrespondentsApiResponseMiddleware,
    caseActionDataMiddleware,
    caseActionApiResponseMiddleware,
    caseDataApiResponseMiddleware,
    caseDataMiddleware,
    caseDataUpdateMiddleware,
    caseConfigMiddleware,
    caseConfigApiResponseMiddleware
} = require('../../middleware/case');
const { somuApiResponseMiddleware } = require('../../middleware/somu');
const { getFormForCase, getFormForStage, getGlobalFormForCase } = require('../../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.post('/:caseId/stage/:stageId/allocate/team',
    fileMiddleware.any(),
    allocateCaseToTeamMember,
    (req, res) => res.json({ redirect: '/' })
);

router.post([
    '/:caseId/stage/:stageId/entity/:entity/:context/:action',
    '/:caseId/stage/:stageId/entity/:entity/:context/:caseType/:action',
    '/:caseId/stage/:stageId/entity/:entity/:action'],
getFormForCase,
fileMiddleware.any(),
processMiddleware,
caseApiResponseMiddleware
);

router.post([
    '/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction',
    '/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction/:caseActionId'
],
caseActionDataMiddleware,
getFormForCase,
fileMiddleware.any(),
processMiddleware,
caseApiResponseMiddleware
);

router.post(['/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/:action',  '/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/item/:somuItemUuid/:action'],
    getFormForCase,
    fileMiddleware.any(),
    processMiddleware,
    somuApiResponseMiddleware
);

router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    fileMiddleware.any(),
    processMiddleware,
    stageApiResponseMiddleware
);
router.post('/:caseId/note',
    fileMiddleware.any(),
    createCaseNote,
    (req, res) => {
        res.json({
            error: res.locals.error
        });
    }
);

router.post('/:caseId/stage/:stageId/form/:formId/data',
    getGlobalFormForCase,
    fileMiddleware.any(),
    processMiddleware,
    caseDataUpdateMiddleware,
    (req, res) => {
        res.json({
            error: res.locals.error
        });
    }
);

router.put('/:caseId/note/:noteId',
    protect('EDIT_CASE_NOTE'),
    fileMiddleware.any(),
    updateCaseNote,
    (req, res) => {
        res.json({
            caseNote: res.locals.caseNote,
            error: res.locals.error
        });
    }
);

router.get('/:caseId/', caseDataMiddleware, caseDataApiResponseMiddleware);

router.get('/:caseId/summary', caseSummaryMiddleware, caseSummaryApiResponseMiddleware);

router.get('/:caseId/config', caseConfigMiddleware, caseConfigApiResponseMiddleware);

router.get('/:caseId/actions', caseActionDataMiddleware, caseActionApiResponseMiddleware);

router.get('/:caseId/correspondents', caseCorrespondentsMiddleware, caseCorrespondentsApiResponseMiddleware);

module.exports = router;
