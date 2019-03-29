const getLogger = require('../libs/logger');
const User = require('../models/user');
const { caseworkService } = require('../clients');

async function userWorkstackMiddleware(req, res, next) {
    try {
        const response = await req.listService.fetch('USER_WORKSTACK', req.params);
        res.locals.workstack = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function teamWorkstackMiddleware(req, res, next) {
    try {
        const response = await req.listService.fetch('TEAM_WORKSTACK', req.params);
        res.locals.workstack = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function workflowWorkstackMiddleware(req, res, next) {
    try {
        const response = await await req.listService.fetch('WORKFLOW_WORKSTACK', req.params);
        res.locals.workstack = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function stageWorkstackMiddleware(req, res, next) {
    try {
        const response = await req.listService.fetch('STAGE_WORKSTACK', req.params);
        res.locals.workstack = response;
        next();
    } catch (error) {
        next(error);
    }
}

async function getTeamMembers(req, res, next) {
    try {
        const response = await req.listService.fetch('USERS_IN_TEAM', req.params);
        res.locals.workstack.teamMembers = response;
        next();
    } catch (error) {
        next(error);
    }
}

function workstackApiResponseMiddleware(req, res) {
    res.json(res.locals.workstack);
}

const allocateUser = async (req, res, [endpoint, body, headers]) => {
    const logger = getLogger(req.requestId);
    try {
        await caseworkService.put(endpoint, body, headers);
        return;
    } catch (error) {
        logger.error('ALLOCATION_FAILED', { endpoint, body, status: error.response.status });
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
            .map(async options => await allocateUser(req, res, options));
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
            .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/user`, { userUUID: req.user.uuid }, {
                headers: User.createHeaders(req.user)
            }])
            .map(async options => await allocateUser(req, res, options));
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
            .map(async options => await allocateUser(req, res, options));
        await Promise.all(requests);
    }
    next();
}

module.exports = {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    getTeamMembers,
    workstackApiResponseMiddleware,
    allocateToTeam,
    allocateToUser,
    unallocate
};