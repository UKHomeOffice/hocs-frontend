const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    getTeamMembers,
    workstackApiResponseMiddleware,
    allocateToUser,
    allocateToTeam,
    unallocate
} = require('../../middleware/workstack');

const { fileMiddleware } = require('../../middleware/file');

router.get('/user', userWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId', teamWorkstackMiddleware, getTeamMembers, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware, getTeamMembers, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware, getTeamMembers, (req, res, next) => {
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
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    workflowWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    stageWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    teamWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    workflowWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    stageWorkstackMiddleware,
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
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/unallocate',
    fileMiddleware.any(),
    unallocate,
    workflowWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

router.post('/team/:teamId/workflow/:workflowId/stage/:stageId/unallocate',
    fileMiddleware.any(),
    unallocate,
    stageWorkstackMiddleware,
    sendWorkstackAllocateApiResponse
);

module.exports = router;