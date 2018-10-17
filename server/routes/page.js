const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware
} = require('../middleware/workstack');
const { dashboardMiddleware } = require('../middleware/dashboard');

router.get('/', dashboardMiddleware);

router.get('/workstack/user', userWorkstackMiddleware);

router.get('/workstack/team/:teamId', teamWorkstackMiddleware);

router.get('/workstack/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware);

router.get('/workstack/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware);

module.exports = router;