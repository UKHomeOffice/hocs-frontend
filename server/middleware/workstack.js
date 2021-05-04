const getLogger = require('../libs/logger');
const User = require('../models/user');
const { caseworkService, workflowService } = require('../clients');

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

async function getMoveTeamOptions(req, res, next) {
    try {
        const response = await req.listService.fetch('MOVE_TEAM_OPTIONS', req.params);
        res.locals.workstack.moveTeamOptions = response;
        next();
    } catch (error) {
        next(error);
    }
}

function workstackApiResponseMiddleware(req, res) {
    res.json(res.locals.workstack);
}

const updateCaseDataMoveTeamRequest = async (req, res, [endpoint, body, headers]) => {
    const logger = getLogger(req.requestId);
    try {
        await workflowService.put(endpoint, body, headers);
        return;
    } catch (error) {
        logger.error('MOVE_TEAM_FAILED', { endpoint, body, status: error.response.status });
        res.locals.notification = 'Failed to update all cases data with new team.';
        return;
    }
};

const sendMoveTeamRequest = async (req, res, [endpoint, body, headers]) => {
    const logger = getLogger(req.requestId);
    try {
        await caseworkService.put(endpoint, body, headers);
        return;
    } catch (error) {
        logger.error('MOVE_TEAM_FAILED', { endpoint, body, status: error.response.status });
        res.locals.notification = 'Failed to transfer all cases to new team.';
        return;
    }
};


const sendAllocateUserRequest = async (req, res, [endpoint, body, headers]) => {
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

async function handleWorkstackSubmit(req, res, next) {
    switch (req.body.submitAction) {
        case 'allocate_to_team_member':
            await allocateToTeamMember(req, res, next);
            break;
        case 'move_team':
            await moveTeam(req, res, next);
            break;
    }
}

async function allocateToTeamMember(req, res, next) {
    const logger = getLogger(req.requestId);
    logger.info('ALLOCATING_TO_TEAM_MEMBER');

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
            .map(async options => await sendAllocateUserRequest(req, res, options));
        await Promise.all(requests);
    }
    next();
}

async function moveTeam(req, res, next) {
    const logger = getLogger(req.requestId);
    logger.info('MOVING_CASE_TEAMS');

    let { selected_cases = [], selected_team } = req.body;
    if (typeof selected_cases === 'string') {
        selected_cases = [selected_cases];
    }

    if (selected_cases.length > 0 && selected_team) {
        const requests = selected_cases
            .map(selected => selected.split(':'));

        const updateCaseDataRequests =
            requests
                .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/CaseworkTeamUUID`, { value: selected_team }, {
                    headers: User.createHeaders(req.user)
                }])
                .map(async options => await updateCaseDataMoveTeamRequest(req, res, options));

        const sendMoveTeamRequests =
            requests
                .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/team`, { teamUUID: selected_team }, {
                    headers: User.createHeaders(req.user)
                }])
                .map(async options => await sendMoveTeamRequest(req, res, options));

        await Promise.all([...updateCaseDataRequests, ...sendMoveTeamRequests]);
    }
    logger.debug('MOVING_CASE_TEAMS', { selected_cases, selected_team });

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
            .map(async options => await sendAllocateUserRequest(req, res, options));
        await Promise.all(requests);
    }
    next();
}

async function allocateNextCaseToUser(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        res.locals.stage = await caseworkService.put(
            `/case/team/${req.params.teamId}/allocate/user/next`,
            {},
            { headers: User.createHeaders(req.user) }
        );
    } catch (error) {
        logger.error('ALLOCATE_NEXT_CASE_FAILED');
        return next(error);
    }
    next();
}

function sendCaseRedirectResponse(req, res) {
    if (typeof res.locals.stage.data.caseUUID === 'string') {
        const caseUrl = `/case/${res.locals.stage.data.caseUUID}/stage/${res.locals.stage.data.uuid}`;
        res.json({
            redirect: caseUrl
        });
    }
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
            .map(async options => await sendAllocateUserRequest(req, res, options));
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
    getMoveTeamOptions,
    moveTeam,
    workstackApiResponseMiddleware,
    handleWorkstackSubmit,
    allocateToUser,
    allocateNextCaseToUser,
    sendCaseRedirectResponse,
    unallocate
};
