const router = require('express').Router();
const { getList } = require('../../services/list');

router.get('/user', async (req, res) => {
    const workstack = await getList('WORKSTACK_USER', { ...req.params, user: req.user });
    res.json(workstack);
});

router.get('/team/:teamId', async (req, res) => {
    const workstack = await getList('WORKSTACK_TEAM', { ...req.params, user: req.user });
    res.json(workstack);
});

router.get('/team/:teamId/workflow/:workflowId', async (req, res) => {
    const workstack = await getList('WORKSTACK_WORKFLOW', { ...req.params, user: req.user });
    res.json(workstack);
});

router.get('/team/:teamId/workflow/:workflowId/stage/:stageId', async (req, res) => {
    const workstack = await getList('WORKSTACK_STAGE', { ...req.params, user: req.user });
    res.json(workstack);
});

module.exports = router;