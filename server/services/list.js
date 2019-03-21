const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { infoServiceClient, caseworkServiceClient, docsServiceClient } = require('../libs/request');
const { listDefinitions, staticListDefinitions } = require('./lists/index');
const logger = require('../libs/logger');
const events = require('../models/events');
const User = require('../models/user');

const listRepository = {
    lists: {},
    hasList: function (key) { return this.lists.hasOwnProperty(key); },
    listIsValid: function (key) { return this.lists[key].status === 'OK'; },
    addList: function (key, value) { return this.lists[key] = value; },
    getList: function (key) { return this.lists[key].data || null; },
    flush: function () { this.lists = {}; }
};

async function initialise() {
    const listRequests = Object.entries(staticListDefinitions).reduce((reducer, [key, value]) => {
        logger.info({ event_id: events.INITIALISE_LIST, list: key });
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
    logger.debug({ event_id: events.FETCH_LIST_REQUEST, endpoint });
    return client.get(endpoint, headers);
}

function handleListSuccess(listId, response) {
    logger.debug({ event_id: events.FETCH_LIST_SUCCESS, list: listId });
    listRepository.addList(listId, { data: response.data, status: 'OK' });
}

function handleListFailure(listId, error) {
    logger.error({ event_id: events.FETCH_LIST_FAILURE, list: listId, stack: error.stack });
    listRepository.addList(listId, { data: [], status: 'FAILED' });
}

function flushCachedLists() {
    listRepository.flush();
}

async function getListFromCache(listId) {
    if (listRepository.hasList(listId) && listRepository.listIsValid(listId)) {
        return listRepository.getList(listId);
    } else {
        logger.info({ event_id: 'LIST_SERVICE_CACHE_MISS', list: listId });
        try {
            const response = await fetchList(staticListDefinitions[listId]);
            handleListSuccess(listId, response);
            return listRepository.getList(listId);
        } catch (error) {
            handleListFailure(listId, error);
            return [];
        }
    }
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
    bindDisplayElements: async row => {
        const sTeams = await getListFromCache('teams');
        const sUsers = await getListFromCache('users');
        const sCaseTypes = await getListFromCache('caseTypes');
        const sStageTypes = await getListFromCache('stageTypes');
        const assignedTeam = sTeams.find(i => i.type === row.teamUUID) || {};
        row.assignedTeamDisplay = assignedTeam.displayName;
        const caseType = sCaseTypes.caseTypes.find(i => i.value === row.caseType) || {};
        row.caseTypeDisplayFull = caseType.label;
        const stageType = sStageTypes.stageTypes.find(i => i.value === row.stageType) || {};
        row.stageTypeDisplay = stageType.label;
        if (row.userUUID) {
            const assignedUser = sUsers.find(i => i.id === row.userUUID) || {};
            row.assignedUserDisplay = assignedUser.email || 'Allocated';
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
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .map(async (r) => bindDisplayElements(r)));
        workstackData.sort((first, second) => first.caseReference > second.caseReference);
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
            }, []);
        return {
            user: userData,
            teams: dashboardData
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_USER': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        const { bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .filter(item => item.userUUID === user.uuid)
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
        return {
            label: '',
            items: workstackData,
            allocateToWorkstackEndpoint: '/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_TEAM': async ({ user, teamId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .filter(item => item.teamUUID === teamId)
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
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
            }, []);
        const sTeams = await getListFromCache('teams');
        return {
            label: ((team = {}) => team.displayName || 'Placeholder team')(sTeams.find(i => i.type === teamId)),
            items: workstackData,
            dashboard: dashboardData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: `${user.firstName} ${user.lastName} (${user.username})`, value: user.id })),
            allocateToUserEndpoint: '/allocate/user',
            allocateToTeamEndpoint: '/allocate/team',
            allocateToWorkstackEndpoint: '/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_WORKFLOW': async ({ user, teamId, workflowId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        const { isOverdue, isUnallocated, setTag, bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId)
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
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
            }, []);
        const sCaseTypes = await getListFromCache('caseTypes');
        return {
            label: ((workflow = {}) => workflow.label || 'Placeholder workflow')(sCaseTypes.caseTypes.find(i => i.value === workflowId)),
            items: workstackData,
            dashboard: dashboardData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: `${user.firstName} ${user.lastName} (${user.username})`, value: user.id })),
            allocateToUserEndpoint: '/allocate/user',
            allocateToTeamEndpoint: '/allocate/team',
            allocateToWorkstackEndpoint: '/unallocate/'
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_STAGE': async ({ user, teamId, workflowId, stageId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        const userTeamsResponse = await fetchList(`/teams/${teamId}/members`, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        const { bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId && item.stageType === stageId)
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
        const sStageTypes = await getListFromCache('stageTypes');
        return {
            label: ((stage = {}) => stage.label || 'Placeholder stage')(sStageTypes.stageTypes.find(i => i.value === stageId)),
            items: workstackData,
            teamMembers: userTeamsResponse.data.map(user => ({ label: `${user.firstName} ${user.lastName} (${user.username})`, value: user.id })),
            allocateToUserEndpoint: '/allocate/user',
            allocateToTeamEndpoint: '/allocate/team',
            allocateToWorkstackEndpoint: '/unallocate'
        };
    },
    'SEARCH': async ({ user, form }) => {
        const request = {
            caseType: form['caseTypes'],
            dateReceived: {
                to: form['dateReceivedTo'],
                from: form['dateReceivedFrom']
            },
            correspondentName: form['correspondent'],
            topic: form['topic'],
            data: [
                { POTeamName: form['signOffMinister'] }
            ],
            activeOnly: Array.isArray(form['caseStatus']) && form['caseStatus'].includes('active')
        };
        const response = await caseworkServiceClient.post('/search', request, {
            headers: User.createHeaders(user)
        });
        const { bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
        return {
            label: 'Search Results',
            items: workstackData
        };
    },
    'SEARCH_REFERENCE': async ({ user, form }) => {
        const reference = encodeURIComponent(form['case-reference']);
        const response = await caseworkServiceClient.get(`/case/${reference}/stage`, {
            headers: User.createHeaders(user)
        });
        const { bindDisplayElements } = helpers;
        const workstackData = await Promise.all(response.data.stages
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(async (r) => bindDisplayElements(r)));
        return {
            label: 'Case workflows',
            items: workstackData
        };
    },
    'CASE_TYPES': async ({ user }) => {
        const list = listDefinitions['workflowTypes'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        });
        if (response.data.caseTypes) {
            return response.data.caseTypes.sort(compareListItems);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TYPES' });
            return [];
        }
    },
    'CASE_TYPES_BULK': async ({ user }) => {
        const list = listDefinitions['workflowTypesBulk'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        });
        if (response.data.caseTypes) {
            return response.data.caseTypes.sort(compareListItems);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TYPES_BULK' });
            return [];
        }
    },
    'CASE_DOCUMENT_LIST': async ({ user, caseId }) => {
        const list = listDefinitions['caseDocuments'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, docsServiceClient);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                });
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_DOCUMENT_LIST' });
            return [];
        }
    },
    'CASE_DOCUMENT_LIST_DRAFT': async ({ user, caseId }) => {
        const list = listDefinitions['caseDocumentsType'].call(this, { caseId, type: 'DRAFT' });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, docsServiceClient);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                })
                .map(d => ({ label: d.displayName, value: d.uuid }));
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_DOCUMENT_LIST_DRAFT' });
            return [];
        }
    },
    'CASE_DOCUMENT_LIST_FINAL': async ({ user, caseId }) => {
        const list = listDefinitions['caseDocumentsType'].call(this, { caseId, type: 'FINAL' });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, docsServiceClient);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                })
                .map(d => ({ label: d.displayName, value: d.uuid }));
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_DOCUMENT_LIST_FINAL' });
            return [];
        }
    },
    'DOCUMENT_EXTENSION_WHITELIST': async () => {
        return DOCUMENT_WHITELIST;
    },
    'MEMBER_LIST': async ({ user }) => {
        const list = listDefinitions['memberList'].call(this, { caseType: 'MIN' });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
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
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'MEMBER_LIST' });
            return [];
        }
    },
    'MINISTERS': async ({ user }) => {
        const list = listDefinitions['ministerList'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        });
        if (response.data.ministers) {
            return response.data.ministers
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'MINISTERS' });
            return [];
        }
    },
    'CASE_STANDARD_LINES': async ({ user, caseId }) => {
        const list = listDefinitions['standardLines'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        if (response.data.displayName && response.data.uuid) {
            return [
                { label: response.data.displayName, value: response.data.uuid }
            ];
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_STANDARD_LINES' });
            return [];
        }
    },
    'CASE_TEMPLATES': async ({ user, caseId }) => {
        const list = listDefinitions['templates'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        if (response.data.displayName && response.data.uuid) {
            return [
                { label: response.data.displayName, value: response.data.uuid }
            ];
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TEMPLATES' });
            return [];
        }

    },
    'CASE_TOPICS': async ({ user, caseId }) => {
        const list = listDefinitions['caseTopics'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        if (response.data.topics) {
            return response.data.topics;
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_TOPICS' });
            return [];
        }
    },
    'TOPICS_CASETYPE': async ({ user, caseId }) => {
        const list = listDefinitions['topicsCaseType'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data.parentTopics) {
            return response.data.parentTopics
                .map(parent => {
                    parent.options = parent.options.sort((first, second) => first.label > second.label);
                    return parent;
                }).sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'TOPICS_CASETYPE' });
            return [];
        }
    },
    'TOPICS_USER': async ({ user }) => {
        const list = listDefinitions['userTopics'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data.parentTopics) {
            return response.data.parentTopics
                .map(parent => {
                    parent.options = parent.options.sort((first, second) => first.label > second.label);
                    return parent;
                }).sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'TOPICS_USER' });
            return [];
        }
    },
    'CORRESPONDENT_TYPES': async ({ user }) => {
        const list = listDefinitions['correspondentTypes'].call(this);
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data.correspondentTypes) {
            return response.data.correspondentTypes.sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CORRESPONDENT_TYPES' });
            return [];
        }
    },
    'CASE_CORRESPONDENTS': async ({ caseId, user }) => {
        const list = listDefinitions['caseCorrespondents'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        if (response.data.correspondents) {
            return response.data.correspondents.map(c => ({ label: c.fullname, value: c.uuid }));
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_CORRESPONDENTS' });
            return [];
        }
    },
    'CASE_SUMMARY': async ({ caseId, user }) => {
        const formatDate = date => Intl.DateTimeFormat('en-GB').format(new Date(date));
        const list = listDefinitions['caseSummary'].call(this, { caseId });
        const response = await fetchList(list, {
            headers: User.createHeaders(user)
        }, caseworkServiceClient);
        if (response.data) {
            const sTeams = await getListFromCache('teams');
            const sUsers = await getListFromCache('users');
            const sStageTypes = await getListFromCache('stageTypes');
            return ({
                case: {
                    received: response.data.DateReceived ? formatDate(response.data.DateReceived) : null,
                    deadline: response.data.caseDeadline ? formatDate(response.data.caseDeadline) : null
                },
                additionalFields: ((additionalFields = []) => additionalFields.map(({ label, value, type }) => type === 'date' ? ({ label, value: formatDate(value) }) : ({ label, value })))(response.data.additionalFields),
                primaryTopic: response.data.primaryTopic ? response.data.primaryTopic.label : null,
                primaryCorrespondent: response.data.primaryCorrespondent ? response.data.primaryCorrespondent.fullname : null,
                deadlines: ((deadlines = {}) => {
                    return Object.entries(deadlines)
                        .sort((first, second) => (first[1] > second[1]) ? 1 : -1)
                        .map(([stage, deadline]) => ({
                            label: (stage => {
                                const stageType = sStageTypes.stageTypes.find(i => i.value === stage) || {};
                                return stageType.label;
                            })(stage),
                            value: deadline ? formatDate(deadline) : null
                        }));
                })(response.data.stageDeadlines),
                stages: ((stages = []) => {
                    return stages.map(activeStage => ({
                        stage: (stage => {
                            const stageType = sStageTypes.stageTypes.find(i => i.value === stage) || {};
                            return stageType.label;
                        })(activeStage.stage),
                        assignedUser: (user => {
                            if (user) {
                                const assignedUser = sUsers.find(i => i.id === user) || {};
                                return assignedUser.username;
                            }
                        })(activeStage.assignedToUserUUID),
                        assignedTeam: (team => {
                            const assignedTeam = sTeams.find(i => i.type === team) || {};
                            return assignedTeam.displayName;
                        })(activeStage.assignedToTeamUUID)
                    }));
                })(response.data.activeStages)
            });
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_CORRESPONDENTS' });
            return [];
        }
    },
    'USERS_IN_TEAM': async ({ user, teamId }) => {
        const response = await fetchList(`/teams/${teamId}/members`, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data) {
            return response.data
                .filter(u => u.email !== user.email)
                .map(({ id, firstName, lastName, email }) => ({
                    label: `${firstName} ${lastName} (${email})`,
                    value: id
                }))
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'USERS_IN_TEAM' });
            return [];
        }
    },
    'USERS_FOR_CASE': async ({ user, caseId, stageId }) => {
        const response = await fetchList(`/case/${caseId}/stage/${stageId}/team/members`, {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data) {
            return response.data
                .map(({ id, firstName, lastName, email }) => ({
                    label: `${firstName} ${lastName} (${email})`,
                    value: id
                }))
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'USERS_FOR_CASE' });
            return [];
        }
    },
    'PRIVATE_OFFICE_TEAMS': async ({ user }) => {
        const response = await fetchList('/teams?unit=PRIVATE_OFFICE', {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data) {
            return response.data
                .map(({ displayName, type }) => ({
                    label: displayName,
                    value: type
                }))
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'PRIVATE_OFFICE_TEAMS' });
            return [];
        }
    },
    'DRAFT_TEAMS': async ({ user }) => {
        const response = await fetchList('/teams/drafters', {
            headers: User.createHeaders(user)
        }, infoServiceClient);
        if (response.data) {
            return response.data
                .map(({ displayName, type }) => ({
                    label: displayName,
                    value: type
                }))
                .sort((first, second) => first.label > second.label);
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'DRAFT_TEAMS' });
            return [];
        }
    },
    'CASE_NOTES': async ({ caseId, user }) => {
        const response = await caseworkServiceClient.get(`/case/${caseId}/timeline`, { headers: User.createHeaders(user) });
        const { data } = response;
        const sStageTypes = await getListFromCache('stageTypes');
        const sUsers = await getListFromCache('users');
        const sTeams = await getListFromCache('teams');
        const getUser = (userId) => {
            const user = sUsers.find(u => u.id === userId) || {};
            return user.email;
        };
        const getTeam = (teamId) => {
            const team = sTeams.find(t => t.type === teamId) || {};
            return team.displayName;
        };
        const getStage = (stageId) => {
            const stage = sStageTypes.stageTypes.find(s => s.value === stageId) || {};
            return stage.label;
        };
        const getTitle = (type) => {
            const types = {
                STAGE_ALLOCATED_TO_USER: 'Allocated to User',
                STAGE_ALLOCATED_TO_TEAM: 'Allocated to Team',
                CORRESPONDENT_CREATED: 'Correspondent Added',
                CORRESPONDENT_DELETED: 'Correspondent Removed',
                CASE_TOPIC_CREATED: 'Topic Added',
                CASE_TOPIC_DELETED: 'Topic Removed',
                CASE_CREATED: 'Case Created',
                CASE_UPDATED: 'Case Updated',
                MANUAL: 'Case Note'
            };
            return types.hasOwnProperty(type) ? types[type] : 'System event';
        };
        if (Array.isArray(data)) {
            return data
                .sort((first, second) => first.eventTime > second.eventTime ? -1 : 1)
                .map(({ eventTime, type, userName: authorId, body = {} }) => {
                    const { caseNote, userUUID: userId, teamUUID: teamId, stage: stageId } = body;
                    return {
                        type,
                        title: getTitle(type),
                        body: {
                            date: Intl.DateTimeFormat('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            }).format(new Date(eventTime)),
                            note: caseNote,
                            author: authorId ? getUser(authorId) : null,
                            user: userId ? getUser(userId) : null,
                            team: teamId ? getTeam(teamId) : null,
                            stage: stageId ? getStage(stageId) : null
                        }
                    };
                });
        } else {
            logger.warn({ event_id: events.FETCH_LIST_RETURN_EMPTY, list: 'CASE_NOTES' });
            return [];
        }
    }
};

async function getList(listId, options = {}) {
    try {
        logger.info({ event_id: events.FETCH_LIST, list: listId, ...options });
        const list = await lists[listId.toUpperCase()].call(this, options);
        return list;
    } catch (error) {
        logger.error({ message: error.message, stack: error.stack });
        logger.error({ event_id: events.FETCH_LIST_FAILURE, list: listId, options });
        throw new Error('Failed to fetch list', error.response.status);
    }
}

module.exports = {
    getList,
    initialise,
    flushCachedLists
};
