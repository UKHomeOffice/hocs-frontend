const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware
} = require('../middleware/workstack');
const { dashboardMiddleware } = require('../middleware/dashboard');

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
        { to: `/team/${req.param.teamId}`, label: 'Team' }
    ];
    next();
});

router.get('/workstack/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/team/${req.param.teamId}`, label: 'Team' },
        { to: `/team/${req.param.teamId}/workflow/${req.param.workflowId}`, label: 'Workflow' }
    ];
    next();
});

router.get('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/team/${req.param.teamId}`, label: 'Team' },
        { to: `/team/${req.param.teamId}/workflow/${req.param.workflowId}`, label: 'Workflow' },
        { to: `/team/${req.param.teamId}/workflow/${req.param.workflowId}/stage/${req.params.stageId}`, label: 'Stage' },
    ];
    next();
});

module.exports = router;