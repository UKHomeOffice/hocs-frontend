const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { infoServiceClient, caseworkServiceClient, docsServiceClient } = require('../libs/request');
const { listDefinitions, staticListDefinitions } = require('./lists/index');
const logger = require('../libs/logger');
const events = require('../models/events');

const listRepository = {
    teams: [{ type: 'ASSIGNED_TEAM', displayName: 'Assigned team' }],
    users: [{ id: 'ASSIGNED_USER', username: 'Assigned user' }],
    caseTypes: [{ value: 'CASE_TYPE', label: 'Case type' }],
    stageTypes: [{ value: 'STAGE_TYPE', label: 'Stage type' }],
};

async function initialise() {
    const listRequests = Object.entries(staticListDefinitions).reduce((reducer, [key, value]) => {
        logger.info({ event: events.INITIALISE_LIST, list: key });
        reducer.push({ list: key, request: fetchList(value) });
        return reducer;
    }, []);

    await listRequests.map(async ({ list, request }) => {
        try {
            const response = await request;
            handleListSuccess(list, response);
        } catch (error) {
            handleListFailure(list, error);
        }
    });
}

function fetchList(endpoint, headers, client = infoServiceClient) {
    logger.debug({ event: events.FETCH_LIST_REQUEST, endpoint });
    return client.get(endpoint, headers);
}

function handleListSuccess(listId, response) {
    logger.debug({ event: events.FETCH_LIST_SUCCESS, list: listId });
    listRepository[listId] = response.data || [];
}

function handleListFailure(listId, error) {
    logger.error({ event: events.FETCH_LIST_FAILURE, list: listId, stack: error.stack });
    // listRepository[listId] = [];
}

function compareListItems(first, second) {
    const firstLabel = first.label.toUpperCase();
    const secondLabel = second.label.toUpperCase();
    return (firstLabel < secondLabel) ? -1 : 1;
}

const helpers = {
    isOverdue: deadline => deadline && new Date(deadline) < Date.now(),
    isUnallocated: user => user === null,
    setTag: current => current ? current + 1 : 1,
    bindDisplayElements: row => {
        const assignedTeam = listRepository.teams.find(i => i.type === row.teamUUID) || {};
        row.assignedTeamDisplay = assignedTeam.displayName;
        const caseType = listRepository.caseTypes.caseTypes.find(i => i.value === row.caseType) || {};
        row.caseTypeDisplay = caseType.displayCode;
        row.caseTypeDisplayFull = caseType.label;
        const stageType = listRepository.stageTypes.stageTypes.find(i => i.value === row.stageType) || {};
        row.stageTypeDisplay = stageType.label;
        if (row.userUUID) {
            const assignedUser = listRepository.users.find(i => i.id === row.userUUID) || {};
            row.assignedUserDisplay = assignedUser.username;
        }
        row.deadlineDisplay = new Intl.DateTimeFormat('en-GB').format(new Date(row.deadline));
        return row;
    }
};

const lists = {
    // TODO: Temporary code to support current workstack implementation
    'DASHBOARD': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = response.data.stages
            .map(bindDisplayElements)
            .sort((first, second) => first.caseReference > second.caseReference);
        const createOverdueTag = data => {
            const overdueCases = data.filter(r => isOverdue(r.deadline));
            return overdueCases.length > 0 ? overdueCases.count : null;
        };
        const userData = [{
            label: 'Cases',
            count: workstackData
                .filter(item => String(item.userUUID) === String(user.uuid)).length,
            tags: {
                overdue: createOverdueTag(workstackData)
            }
        }];
        const dashboardData = workstackData
            .reduce((result, row) => {
                const index = result.map(c => c.value).indexOf(row.teamUUID);
                if (index === -1) {
                    result.push({
                        label: row.assignedTeamDisplay,
                        value: row.teamUUID,
                        type: 'team',
                        count: 1,
                        tags: {
                            overdue: isOverdue(row.deadline) ? setTag(0) : null,
                            allocated: isUnallocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isUnallocated(row.userUUID)) {
                        result[index].tags.allocated = setTag(result[index].tags.allocated);
                    }
                }
                return result;
            }, [])
            .sort((first, second) => first.count < second.count);
        return {
            user: userData,
            teams: dashboardData
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_USER': async ({ teamId = '44444444-2222-2222-2222-222222222222', user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        const { bindDisplayElements } = helpers;
        const workstackData = response.data.stages
            .filter(item => item.userUUID === user.uuid)
            .map(bindDisplayElements)
            .sort((first, second) => first.caseReference > second.caseReference);
        return {
            label: 'User workstack',
            items: workstackData,
            allocateToWorkstackEndpoint: '/workstack/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_TEAM': async ({ user, teamId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, infoServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = response.data.stages
            .filter(item => item.teamUUID === teamId)
            .map(bindDisplayElements)
            .sort((first, second) => first.caseReference > second.caseReference);
        const dashboardData = workstackData
            .reduce((result, row) => {
                const index = result.map(c => c.value).indexOf(row.caseType);
                if (index === -1) {
                    result.push({
                        label: row.caseTypeDisplayFull,
                        value: row.caseType,
                        type: 'workflow',
                        count: 1,
                        tags: {
                            overdue: isOverdue(row.deadline) ? setTag(0) : null,
                            allocated: isUnallocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isUnallocated(row.userUUID)) {
                        result[index].tags.allocated = setTag(result[index].tags.allocated);
                    }
                }
                return result;
            }, [])
            .sort((first, second) => first.count < second.count ? 1 : -1);
        return {
            label: ((team = {}) => team.displayName || 'Placeholder team')(listRepository.teams.find(i => i.type === teamId)),
            items: workstackData,
            dashboard: dashboardData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: user.username, value: user.id })),
            allocateToUserEndpoint: '/workstack/allocate/user',
            allocateToTeamEndpoint: '/workstack/allocate/team',
            allocateToWorkstackEndpoint: '/workstack/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_WORKFLOW': async ({ user, teamId, workflowId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, infoServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = response.data.stages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId)
            .map(bindDisplayElements)
            .sort((first, second) => first.caseReference > second.caseReference);
        const dashboardData = workstackData
            .reduce((result, row) => {
                const index = result.map(c => c.value).indexOf(row.stageType);
                if (index === -1) {
                    result.push({
                        label: row.stageTypeDisplay,
                        value: row.stageType,
                        type: 'stage',
                        count: 1,
                        tags: {
                            overdue: isOverdue(row.deadline) ? setTag(0) : null,
                            allocated: isUnallocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isUnallocated(row.userUUID)) {
                        result[index].tags.allocated = setTag(result[index].tags.allocated);
                    }
                }
                return result;
            }, [])
            .sort((first, second) => first.count < second.count);
        return {
            label: ((workflow = {}) => workflow.label || 'Placeholder workflow')(listRepository.caseTypes.caseTypes.find(i => i.value === workflowId)),
            items: workstackData,
            dashboard: dashboardData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: user.username, value: user.id })),
            allocateToUserEndpoint: '/workstack/allocate/user',
            allocateToTeamEndpoint: '/workstack/allocate/team',
            allocateToWorkstackEndpoint: '/workstack/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_STAGE': async ({ user, teamId, workflowId, stageId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, infoServiceClient);
        const { bindDisplayElements } = helpers;
        const workstackData = response.data.stages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId && item.stageType === stageId)
            .map(bindDisplayElements)
            .sort((first, second) => first.caseReference > second.caseReference);
        return {
            label: ((stage = {}) => stage.label || 'Placeholder stage')(listRepository.stageTypes.stageTypes.find(i => i.value === stageId)),
            items: workstackData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: user.username, value: user.id })),
            allocateToUserEndpoint: '/workstack/allocate/user',
            allocateToTeamEndpoint: '/workstack/allocate/team',
            allocateToWorkstackEndpoint: '/workstack/unallocate'
        };
    },
    'CASE_TYPES': async ({ user }) => {
        const list = listDefinitions['workflowTypes'].call(this);
        const headerRoles = user.roles.join();
        const response = await fetchList(list, {
            headers: {
                'X-Auth-Roles': headerRoles
            }
        });
        if (response.data.caseTypes) {
            return response.data.caseTypes.sort(compareListItems);
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TYPES' });
            return [];
        }

    },
    'CASE_TYPES_BULK': async ({ user }) => {
        const list = listDefinitions['workflowTypesBulk'].call(this);
        const headerRoles = user.roles.join();
        const response = await fetchList(list, {
            headers: {
                'X-Auth-Roles': headerRoles
            }
        });
        if (response.data.caseTypes) {
            return response.data.caseTypes.sort(compareListItems);
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TYPES_BULK' });
            return [];
        }
    },
    'CASE_DOCUMENT_LIST': async ({ caseId }) => {
        const list = listDefinitions['caseDocuments'].call(this, { caseId });
        const response = await fetchList(list, null, docsServiceClient);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                });
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_DOCUMENT_LIST' });
            return [];
        }
    },
    'CASE_DOCUMENT_LIST_DRAFT': async ({ caseId }) => {
        const list = listDefinitions['caseDocumentsType'].call(this, { caseId, type: 'DRAFT' });
        const response = await fetchList(list, null, docsServiceClient);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                })
                .map(d => ({ label: d.displayName, value: d.uuid }));
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_DOCUMENT_LIST_DRAFT' });
            return [];
        }
    },
    'DOCUMENT_EXTENSION_WHITELIST': async () => {
        return DOCUMENT_WHITELIST;
    },
    'MEMBER_LIST': async ({ user }) => {
        const list = listDefinitions['memberList'].call(this, { caseType: 'MIN' });
        const headerRoles = user.roles.join();
        const response = await fetchList(list, {
            headers: {
                'X-Auth-Roles': headerRoles
            }
        });
        if (response.data.members) {
            const groupedList = response.data.members
                .sort(compareListItems)
                .reduce((reducer, item) => {
                    const groupIndex = reducer.map(e => e.label).indexOf(item.group);
                    if (groupIndex === -1) {
                        reducer.push({
                            label: item.group, options: [{
                                label: item.label, value: item.value
                            }]
                        });
                        return reducer;
                    }
                    reducer[groupIndex].options.push({ label: item.label, value: item.value });
                    return reducer;
                }, []);
            return groupedList;
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'MEMBER_LIST' });
            return [];
        }
    },
    'MINISTERS': async () => {
        const list = listDefinitions['ministerList'].call(this);
        const response = await fetchList(list);
        if (response.data.ministers) {
            return response.data.ministers
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'MINISTERS' });
            return [];
        }
    },
    'CASE_STANDARD_LINES': async ({ caseId }) => {
        const list = listDefinitions['standardLines'].call(this, { caseId });
        const response = await fetchList(list, null, infoServiceClient);
        if (response.data.label && response.data.value) {
            const { label, value } = response.data;
            return [
                { label, value }
            ];
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_STANDARD_LINES' });
            return [];
        }
    },
    'CASE_TEMPLATES': async ({ caseId }) => {
        const list = listDefinitions['templates'].call(this, { caseId });
        const response = await fetchList(list, null, infoServiceClient);
        if (response.data.label && response.data.value) {
            const { label, value } = response.data;
            return [
                { label, value }
            ];
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TEMPLATES' });
            return [];
        }

    },
    'CASE_TOPICS': async ({ caseId }) => {
        const list = listDefinitions['caseTopics'].call(this, { caseId });
        const response = await fetchList(list, null, caseworkServiceClient);
        if (response.data.topics) {
            return response.data.topics;
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TOPICS' });
            return [];
        }
    },
    'TOPICS_CASETYPE': async ({ caseId }) => {
        const list = listDefinitions['topicsCaseType'].call(this, { caseId });
        const response = await fetchList(list, null, infoServiceClient);
        if (response.data.parentTopics) {
            return response.data.parentTopics;
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'TOPICS_CASETYPE' });
            return [];
        }
    },
    'TOPICS_USER': async () => {
        const list = listDefinitions['userTopics'].call(this);
        const response = await fetchList(list, null, infoServiceClient);
        if (response.data.parentTopics) {
            return response.data.parentTopics;
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'TOPICS_USER' });
            return [];
        }
    },
    'CORRESPONDENT_TYPES': async () => {
        const list = listDefinitions['correspondentTypes'].call(this);
        const response = await fetchList(list, null, infoServiceClient);
        if (response.data.correspondentTypes) {
            return response.data.correspondentTypes;
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CORRESPONDENT_TYPES' });
            return [];
        }
    },
    'CASE_CORRESPONDENTS': async ({ caseId, user }) => {
        const list = listDefinitions['caseCorrespondents'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: {
                'X-Auth-UserId': user.id,
                'X-Auth-Roles': user.roles.join(),
                'X-Auth-Groups': user.groups.join()
            }
        }, caseworkServiceClient);
        if (response.data.correspondents) {
            return response.data.correspondents.map(c => ({ label: c.fullname, value: c.uuid }));
        } else {
            logger.warn({ event: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_CORRESPONDENTS' });
            return [];
        }
    }
};

async function getList(listId, options = {}) {
    const userRoles = options.user ? options.user.roles : null;
    try {
        logger.info({ event: events.FETCH_LIST, list: listId, ...options, user: { roles: userRoles } });
        const list = await lists[listId.toUpperCase()].call(this, options);
        return list;
    } catch (e) {
        logger.error({ event: events.FETCH_LIST_FAILURE, list: listId, options });
        logger.error(e.stack);
        throw new Error(`Unable to get list for ${listId}`);
    }
}

module.exports = {
    getList,
    initialise
};
