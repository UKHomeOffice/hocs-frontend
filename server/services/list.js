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
// TODO: Cry in to my hands, temporary code..
function temporaryWorkstackToDashboardAdapter(workstack) {
    const temp = workstack.reduce((reducer, item) => {
        if (!reducer[item.teamUUID]) {
            reducer[item.teamUUID] = { label: item.assignedTeamDisplay, value: item.teamUUID, items: {} };
        }
        if (!reducer[item.teamUUID].items[item.caseType]) {
            reducer[item.teamUUID].items[item.caseType] = { label: item.caseTypeDisplay, value: item.caseType, items: {} };
        }
        if (!reducer[item.teamUUID].items[item.caseType].items[item.stageType]) {
            reducer[item.teamUUID].items[item.caseType].items[item.stageType] = { label: item.stageTypeDisplay, value: item.stageType, count: 0 };
        }
        reducer[item.teamUUID].items[item.caseType].items[item.stageType].count++;
        return reducer;
    }, {});
    /* eslint-disable-next-line  no-unused-vars*/
    const teams = Object.entries(temp).reduce((reducer_2, [key, team]) => {
        reducer_2.push({
            label: `Team ${team.label}`,
            value: team.value,
            /* eslint-disable-next-line  no-unused-vars*/
            items: Object.entries(team.items).reduce((reducer_3, [key_2, workflow]) => {
                reducer_3.push({
                    label: workflow.label,
                    value: workflow.value,
                    /* eslint-disable-next-line  no-unused-vars*/
                    items: Object.entries(workflow.items).reduce((reducer_4, [key_3, stage]) => {
                        reducer_4.push({ label: stage.label, value: stage.value, count: stage.count });
                        return reducer_4;
                    }, []).sort((first, second) => {
                        const firstCount = first.count;
                        const secondCount = second.count;
                        return (firstCount < secondCount) ? 1 : -1;
                    })
                });
                return reducer_3;
            }, []).sort((first, second) => {
                const firstLabel = first.label.toUpperCase();
                const secondLabel = second.label.toUpperCase();
                return (firstLabel > secondLabel) ? 1 : -1;
            })
        });
        return reducer_2;
    }, []).sort((first, second) => {
        const firstLabel = first.label.toUpperCase();
        const secondLabel = second.label.toUpperCase();
        return (firstLabel > secondLabel) ? 1 : -1;
    });
    const userValues = workstack.filter(i => i.userUUID !== null);
    const dashboard = {
        user: {
            label: 'Cases', count: userValues.length, tags: {}
        },
        teams
    };
    return dashboard;
}

const lists = {
    // TODO: Temporary code to support current workstack implementation
    'DASHBOARD': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const dashboadData = response.data.activeStages;
        return temporaryWorkstackToDashboardAdapter(dashboadData);
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_USER': async ({ user }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const dashboadData = response.data.activeStages;
        return {
            label: 'User workstack',
            items: dashboadData.filter(item => item.userUUID !== null)
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_TEAM': async ({ user, teamId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const dashboadData = response.data.activeStages;
        return {
            label: 'Team workstack',
            items: dashboadData.filter(item => item.teamUUID === teamId)
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_WORKFLOW': async ({ user, teamId, workflowId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const dashboadData = response.data.activeStages;
        return {
            label: 'Case type workstack',
            items: dashboadData.filter(item => item.teamUUID === teamId && item.caseType === workflowId)
        };
    },
    // TODO: Temporary code to support current workstack implementation
    'WORKSTACK_STAGE': async ({ user, teamId, workflowId, stageId }) => {
        const list = listDefinitions['dashboard'].call(this);
        const response = await caseworkServiceClient.get(list, {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join()
        });
        const dashboadData = response.data.activeStages;
        return {
            label: 'Stage workstack',
            items: dashboadData.filter(item => item.teamUUID === teamId && item.caseType === workflowId && item.stageType === stageId)
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
                .sort((first, second) => first.label > second.label ? 1 : -1);
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