const router = require('express').Router();
const { fileMiddleware } = require('../../middleware/file');
const { processMiddleware } = require('../../middleware/process');
const { validationMiddleware } = require('../../middleware/validation');
const { protect } = require('../../middleware/auth');
const { stageApiResponseMiddleware, allocateCase, allocateCaseToTeamMember } = require('../../middleware/stage');
const { caseSummaryMiddleware, caseSummaryApiResponseMiddleware, caseApiResponseMiddleware, createCaseNote, updateCaseNote } = require('../../middleware/case');
const { getFormForCase, getFormForStage } = require('../../services/form');

router.get('/:caseId/stage/:stageId/allocate', allocateCase);
router.post('/:caseId/stage/:stageId/allocate/team',
    fileMiddleware.any(),
    allocateCaseToTeamMember,
    (req, res) => res.json({ redirect: '/' })
);
router.post(['/:caseId/stage/:stageId/entity/:entity/:context/:action', '/:caseId/stage/:stageId/entity/:entity/:action'],
    getFormForCase,
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
    caseApiResponseMiddleware
);
router.post(['/:caseId/stage/:stageId', '/:caseId/stage/:stageId/allocate'],
    getFormForStage,
    fileMiddleware.any(),
    processMiddleware,
    validationMiddleware,
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

router.get('/:caseId/summary', caseSummaryMiddleware, caseSummaryApiResponseMiddleware);

module.exports = router;