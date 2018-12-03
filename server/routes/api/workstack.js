const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware
} = require('../../middleware/workstack');

router.get('/user', userWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId',teamWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/team/${req.params.teamId}`, label: 'Team' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId',workflowWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/team/${req.params.teamId}`, label: 'Team' },
        { to: `/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' }
    ];
    next();
}, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId/stage/:stageId',stageWorkstackMiddleware, (req, res, next) => {
    res.locals.workstack.breadcrumbs = [
        { to: '/', label: 'Dashboard' },
        { to: `/team/${req.params.teamId}`, label: 'Team' },
        { to: `/team/${req.params.teamId}/workflow/${req.params.workflowId}`, label: 'Workflow' },
        { to: `/team/${req.params.teamId}/workflow/${req.params.workflowId}/stage/${req.params.stageId}`, label: 'Stage' },
    ];
    next();
}, workstackApiResponseMiddleware);

module.exports = router;