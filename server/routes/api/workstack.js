const router = require('express').Router();
const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware
} = require('../../middleware/workstack');

router.get('/user', userWorkstackMiddleware, workstackApiResponseMiddleware);

router.get('/team/:teamId', teamWorkstackMiddleware, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId', workflowWorkstackMiddleware, workstackApiResponseMiddleware);

router.get('/team/:teamId/workflow/:workflowId/stage/:stageId', stageWorkstackMiddleware, workstackApiResponseMiddleware);

module.exports = router;