const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    getTeamMembers,
    getMoveTeamOptions,
    workstackApiResponseMiddleware,
    allocateToUser,
    handleWorkstackSubmit,
    unallocate,
    allocateNextCaseToUser,
    sendCaseRedirectResponse
} = require('../../middleware/workstack');

const { fileMiddleware } = require('../../middleware/file');

router.get('/user', userWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId', teamWorkstackMiddleware, getTeamMembers, getMoveTeamOptions, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware, getTeamMembers, getMoveTeamOptions, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware, getTeamMembers, getMoveTeamOptions, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`, label: 'Stage' },
    ];
    next();
}, workstackApiResponseMiddleware);

function sendWorkstackAllocateApiResponse(req, res) {
    res.json({
        notification: res.locals.notification,
        workstack: res.locals.workstack
    });
}

router.post('/team/:teamId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    teamWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    workflowWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    stageWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/allocate/team',
    fileMiddleware.any(),
    handleWorkstackSubmit,
    teamWorkstackMiddleware,
    getTeamMembers,
    getMoveTeamOptions,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/allocate/team',
    fileMiddleware.any(),
    handleWorkstackSubmit,
    workflowWorkstackMiddleware,
    getTeamMembers,
    getMoveTeamOptions,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/team',
    fileMiddleware.any(),
    handleWorkstackSubmit,
    stageWorkstackMiddleware,
    getTeamMembers,
    getMoveTeamOptions,
    sendWorkstackAllocateApiResponse
);

router.post('/user/unallocate',
    fileMiddleware.any(),
    unallocate,
    userWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/unallocate',
    fileMiddleware.any(),
    unallocate,
    teamWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/unallocate',
    fileMiddleware.any(),
    unallocate,
    workflowWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/unallocate',
    fileMiddleware.any(),
    unallocate,
    stageWorkstackMiddleware,
    getTeamMembers,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/allocate/user/next',
    fileMiddleware.any(),
    allocateNextCaseToUser,
    sendCaseRedirectResponse
);

module.exports = router;
