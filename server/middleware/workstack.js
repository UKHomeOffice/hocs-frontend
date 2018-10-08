const { getList } = require('../services/list');

async function userWorkstackMiddleware(req, res, next) {
    try {
        const response = await getList('WORKSTACK_USER', { ...req.params, user: req.user });
        res.locals.workstack = response;
        next();
    } catch (e) {
        next(e);
    }
}

async function teamWorkstackMiddleware(req, res, next) {
    try {
        const response = await getList('WORKSTACK_TEAM', { ...req.params, user: req.user });
        res.locals.workstack = response;
        next();
    } catch (e) {
        next(e);
    }
}

async function workflowWorkstackMiddleware(req, res, next) {
    try {
        const response = await getList('WORKSTACK_WORKFLOW', { ...req.params, user: req.user });
        res.locals.workstack = response;
        next();
    } catch (e) {
        next(e);
    }
}

async function stageWorkstackMiddleware(req, res, next) {
    try {
        const response = await getList('WORKSTACK_STAGE', { ...req.params, user: req.user });
        res.locals.workstack = response;
        next();
    } catch (e) {
        next(e);
    }
}

function workstackApiResponseMiddleware(req, res) {
    res.json(res.locals.workstack);
}

module.exports = {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware
};