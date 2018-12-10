const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    allocateToUser,
    allocateToTeam,
    unallocate
} = require('../middleware/workstack');
const { dashboardMiddleware } = require('../middleware/dashboard');
const { fileMiddleware } = require('../middleware/file');

router.get('/', dashboardMiddleware);

router.get('/workstack/user', userWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' }
    ];
    next();
});

router.get('/workstack/team/:teamId', teamWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' }
    ];
    next();
});

router.get('/workstack/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' }
    ];
    next();
});

router.get('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/workstack/team/${req.params.teamId}`, label: 'Team' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' },
        { to: `/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`, label: 'Stage' },
    ];
    next();
});

router.post('/workstack/team/:teamId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/user',
    fileMiddleware.any(),
    allocateToUser,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`);
    }
);

router.post('/workstack/team/:teamId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId/allocate/team',
    fileMiddleware.any(),
    allocateToTeam,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`);
    }
);

router.post('/workstack/user/unallocate',
    fileMiddleware.any(),
    unallocate,
    (req, res) => {
        res.redirect(`/workstack/user`);
    }
);

router.post('/workstack/team/:teamId/unallocate',
    fileMiddleware.any(),
    unallocate,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/unallocate',
    fileMiddleware.any(),
    unallocate,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}`);
    }
);

router.post('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId/unallocate',
    fileMiddleware.any(),
    unallocate,
    (req, res) => {
        res.redirect(`/workstack/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`);
    }
);

module.exports = router;