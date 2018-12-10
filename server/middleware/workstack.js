const { getList } = require('../services/list');
const logger = require('../libs/logger');
const User = require('../models/user');
const { caseworkServiceClient } = require('../libs/request');

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

const allocateUser = async (res, [endpoint, body, headers]) => {
    try {
        await caseworkServiceClient.post(endpoint, body, headers);
        return;
    } catch (error) {
        logger.error({ event: 'ALLOCATION_FAILED', endpoint, body, headers, status: error.response.status });
        res.locals.notification = 'Failed to allocate all cases';
        return;
    }
};

async function allocateToTeam(req, res, next) {
    let { selected_cases = [], selected_user } = req.body;
    if (typeof selected_cases === 'string') {
        selected_cases = [selected_cases];
    }
    if (selected_cases.length > 0 && selected_user) {
        const requests = selected_cases
            .map(selected => selected.split(':'))
            .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/user`, { userUUID: selected_user }, {
                headers: User.createHeaders(req.user)
            }])
            .map(async options => await allocateUser(res, options));
        await Promise.all(requests);
    }
    next();
}

async function allocateToUser(req, res, next) {
    let { selected_cases = [] } = req.body;
    if (typeof selected_cases === 'string') {
        selected_cases = [selected_cases];
    }
    if (selected_cases.length > 0) {
        const requests = selected_cases
            .map(selected => selected.split(':'))
            .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/user`, { userUUID: req.user.id }, {
                headers: User.createHeaders(req.user)
            }])
            .map(async options => await allocateUser(res, options));
        await Promise.all(requests);
    }
    next();
}

async function unallocate(req, res, next) {
    let { selected_cases = [] } = req.body;
    if (typeof selected_cases === 'string') {
        selected_cases = [selected_cases];
    }
    if (selected_cases.length > 0) {
        const requests = selected_cases
            .map(selected => selected.split(':'))
            .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/user`, { userUUID: null }, {
                headers: User.createHeaders(req.user)
            }])
            .map(async options => await allocateUser(res, options));
        await Promise.all(requests);
    }
    next();
}

module.exports = {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware,
    allocateToTeam,
    allocateToUser,
    unallocate
};