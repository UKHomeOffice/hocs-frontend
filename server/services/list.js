const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { infoServiceClient, workflowServiceClient, caseworkServiceClient, docsServiceClient } = require('../libs/request');
const { listDefinitions, staticListDefinitions } = require('./lists/index');
const logger = require('../libs/logger');

const listRepository = {};

async function initialise() {
    const listRequests = Object.entries(staticListDefinitions).reduce((reducer, [key, value]) => {
        logger.info(`Fetching list: ${key}`);
        reducer.push({ key, request: fetchList(value) });
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

function fetchList(listEndpoint, options) {
    logger.info(`Fetching list: ${listEndpoint}`);
    return infoServiceClient.get(listEndpoint, options);
}

function handleListSuccess(listId, response) {
    logger.info(`Successfully intialised list: ${listId}`);
    listRepository[listId] = response.data[listId] || [];
}

function handleListFailure(listId, error) {
    logger.error(`Unable to intialise list ${listId}: ${error.message}`);
}
// Cache miss pattern for static lists
// if (listRepository.workflowTypes) {
//     return listRepository.workflowTypes;
// } else {
//     const list = 'workflowTypes';
//     logger.info(`List ${list} unavailable, attempting to retrieve`);
//     try {
//         const response = await fetchList(list);
//         handleListSuccess(list, response);
//         return response.data.workflowTypes
//             .filter(listItem => User.hasRole(user, listItem.requiredRole));
//     } catch (err) {
//         handleListFailure(list, err);
//     }
// }

function compareListItems(first, second) {
    const firstLabel = first.label.toUpperCase();
    const secondLabel = second.label.toUpperCase();
    return (firstLabel < secondLabel) ? -1 : 1;
}

const helpers = {
    isOverdue: deadline => deadline && new Date(deadline) < Date.now(),
    isAllocated: user => user !== null,
    setTag: current => current ? current + 1 : 1,
};

const lists = {
    // TODO: Temporary code to support current workstack implementation
    'DASHBOARD': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const workstackData = response.data.activeStages
            .sort((first, second) => first.caseReference > second.caseReference);
        const { isOverdue, isAllocated, setTag } = helpers;
        const createOverdueTag = data => {
            const overdueCases = data.filter(r => isOverdue(r.deadline));
            return overdueCases.length > 0 ? overdueCases.count : null;
        };
        const userData = [{
            label: 'Cases',
            count: workstackData
                .filter(i => i.userUUID !== null).length,
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
                            allocated: isAllocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isAllocated(row.userUUID)) {
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
    'WORKSTACK_USER': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const workstackData = response.data.activeStages
            .sort((first, second) => first.caseReference > second.caseReference);
        return {
            label: 'User workstack',
            items: workstackData.filter(item => item.userUUID !== null)
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_TEAM': async ({ user, teamId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const workstackData = response.data.activeStages
            .filter(item => item.teamUUID === teamId)
            .sort((first, second) => first.caseReference > second.caseReference);
        const { isOverdue, isAllocated, setTag } = helpers;
        const dashboardData = workstackData
            .reduce((result, row) => {
                const index = result.map(c => c.value).indexOf(row.caseType);
                if (index === -1) {
                    result.push({
                        label: row.caseTypeDisplay,
                        value: row.caseType,
                        type: 'workflow',
                        count: 1,
                        tags: {
                            overdue: isOverdue(row.deadline) ? setTag(0) : null,
                            allocated: isAllocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isAllocated(row.userUUID)) {
                        result[index].tags.allocated = setTag(result[index].tags.allocated);
                    }
                }
                return result;
            }, [])
            .sort((first, second) => first.count < second.count ? 1 : -1);
        return {
            label: 'Placeholder Team',
            items: workstackData,
            dashboard: dashboardData
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_WORKFLOW': async ({ user, teamId, workflowId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const workstackData = response.data.activeStages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId)
            .sort((first, second) => first.caseReference > second.caseReference);
        const { isOverdue, isAllocated, setTag } = helpers;
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
                            allocated: isAllocated(row.userUUID) ? setTag(0) : null
                        }
                    });
                } else {
                    result[index].count++;
                    if (isOverdue(row.deadline)) {
                        result[index].tags.overdue = setTag(result[index].tags.overdue);
                    }
                    if (isAllocated(row.userUUID)) {
                        result[index].tags.allocated = setTag(result[index].tags.allocated);
                    }
                }
                return result;
            }, [])
            .sort((first, second) => first.count < second.count);
        return {
            label: 'Placeholder Workflow',
            items: workstackData,
            dashboard: dashboardData
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_STAGE': async ({ user, teamId, workflowId, stageId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const workstackData = response.data.activeStages
            .filter(item => item.teamUUID === teamId && item.caseType === workflowId && item.stageType === stageId)
            .sort((first, second) => first.caseReference > second.caseReference);
        return {
            label: 'Placeholder Stage',
            items: workstackData
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
            logger.warn(`No Case Types returned for roles: ${headerRoles}`);
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
            logger.warn(`No Case Types returned for roles: ${headerRoles}`);
            return [];
        }
    },
    'CASE_DOCUMENT_LIST': async ({ caseId }) => {
        const list = listDefinitions['caseDocuments'].call(this, { caseId });
        const response = await docsServiceClient.get(list);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                });
        } else {
            logger.warn(`No documents returned for case: ${caseId}`);
            return [];
        }
    },
    'CASE_DOCUMENT_LIST_DRAFT': async ({ caseId }) => {
        const list = listDefinitions['caseDocumentsType'].call(this, { caseId, type: 'DRAFT' });
        const response = await docsServiceClient.get(list);
        if (response.data.documents) {
            return response.data.documents
                .sort((first, second) => {
                    const firstTimeStamp = first.created.toUpperCase();
                    const secondTimeStamp = second.created.toUpperCase();
                    return (firstTimeStamp > secondTimeStamp) ? 1 : -1;
                })
                .map(d => ({ label: d.displayName, value: d.uuid }));
        } else {
            logger.warn(`No documents returned for case: ${caseId}`);
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
            logger.warn('No members returned for case');
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
            logger.warn('No ministers returned for case');
            return [];
        }
    },
    'CASE_STANDARD_LINES': async ({ caseId }) => {
        const response = await workflowServiceClient.get(`/case/${caseId}/standard_lines`);
        if (response.data.standardLines) {
            return response.data.standardLines;
        } else {
            logger.warn(`No standard lines returned for case: ${caseId}`);
            return [];
        }
    },
    'CASE_TEMPLATES': async ({ caseId }) => {
        const response = await workflowServiceClient.get(`/case/${caseId}/templates`);
        if (response.data.templates) {
            return response.data.templates;
        } else {
            logger.warn(`No templates returned for case: ${caseId}`);
            return [];
        }

    },
    'CASE_TOPICS': async ({ caseId }) => {
        const response = await workflowServiceClient.get(`/case/${caseId}/topic`);
        if (response.data.topics) {
            return response.data.topics;
        } else {
            logger.warn(`No returned for topic for case: ${caseId}`);
            return [];
        }
    },
    'TOPICS_CASETYPE': async ({ caseId }) => {
        const response = await workflowServiceClient.get(`/case/${caseId}/topiclist`);
        if (response.data.parentTopics) {
            return response.data.parentTopics;
        } else {
            logger.warn('No returned for topic for case');
            return [];
        }
    },
    'CORRESPONDENT_TYPES': async ({ caseId }) => {
        const response = await infoServiceClient.get('/correspondenttype');
        if (response.data.correspondentTypes) {
            return response.data.correspondentTypes;
        } else {
            logger.warn(`No correspondent types returned for case: ${caseId}`);
            return [];
        }
    },
    'CASE_CORRESPONDENTS': async ({ caseId }) => {
        const response = await caseworkServiceClient.get(`/case/${caseId}/correspondent`);
        if (response.data.correspondents) {
            return response.data.correspondents;
        } else {
            logger.warn(`No correspondents returned for case: ${caseId}`);
            return [];
        }
    }
};

async function getList(listId, options) {
    try {
        logger.debug(`Fetching list '${listId}' with parameters: ${JSON.stringify(options)}`);
        const list = await lists[listId.toUpperCase()].call(this, options);
        logger.debug(`Returning ${list.length} items for ${listId}`);
        return list;
    } catch (e) {
        throw new Error(`Unable to get list for ${listId}: ${e}`);
    }
}

module.exports = {
    getList,
    initialise
};