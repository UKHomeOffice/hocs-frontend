const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { infoServiceClient, workflowServiceClient, caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { listDefinitions, staticListDefinitions } = require('./lists/index');

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
    logger.info(`Successfully fetched list: ${listId}`);
    listRepository[listId] = response.data[listId] || [];
}

function handleListFailure(listId, error) {
    logger.error(`Unable to retrieve list ${listId}: ${error.message}`);
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

const lists = {
    'CASE_TYPES': async ({ user }) => {
        const list = listDefinitions['workflowTypes'].call(this);
        try {
            const headerRoles = user.roles.join();
            logger.info(`Roles ${headerRoles}`);
            const response = await fetchList(list, {
                headers: {
                    'X-Auth-Roles': headerRoles
                }
            });
            logger.info(JSON.stringify(response.data));
            return response.data.caseTypes.sort(compareListItems);
        } catch (error) {
            handleListFailure(list, error);
        }

    },
    'CASE_TYPES_BULK': async ({ user }) => {
        const list = listDefinitions['workflowTypesBulk'].call(this);
        try {
            const headerRoles = user.roles.join();
            logger.info(`Roles ${headerRoles}`);
            const response = await fetchList(list, {
                headers: {
                    'X-Auth-Roles': headerRoles
                }
            });
            return response.data.caseTypes.sort(compareListItems);
        } catch (error) {
            handleListFailure(list, error);
        }

    },
    'DOCUMENT_EXTENSION_WHITELIST': async () => {
        return DOCUMENT_WHITELIST;
    },
    'MEMBER_LIST': async ({ user }) => {
        const list = listDefinitions['memberList'].call(this, { caseType: 'MIN' });
        try {
            const headerRoles = user.roles.join();
            logger.info(`Roles ${headerRoles}`);
            const response = await fetchList(list, {
                headers: {
                    'X-Auth-Roles': headerRoles
                }
            });
            const groupedList = response.data.members
                .sort(compareListItems)
                .reduce((reducer, item) => {
                    const groupIndex = reducer.map(e => e.label).indexOf(item.group);
                    if (groupIndex === -1) {
                        reducer.push({ label: item.group, options: [{
                            label: item.label, value: item.value }]
                        });
                        return reducer;
                    }
                    reducer[groupIndex].options.push({ label: item.label, value: item.value });
                    return reducer;
                }, []);
            return groupedList;
        } catch (error) {
            handleListFailure(list, error);
        }
    },
    'CASE_STANDARD_LINES': async ({ caseId }) => {
        const response = await workflowServiceClient(`/case/${caseId}/standard_lines`);
        if (response.data.standardLines) {
            return response.data.standardLines;
        } else {
            logger.warn(`No standard lines returned for case: ${caseId}`);
            return [];
        }
    },
    'CASE_TEMPLATES': async ({ caseId }) => {
        const response = await workflowServiceClient(`/case/${caseId}/templates`);
        if (response.data.templates) {
            return response.data.templates;
        } else {
            logger.warn(`No templates returned for case: ${caseId}`);
            return [];
        }

    },
    'CASE_TOPICS': async ({ caseId }) => {
        const response = await workflowServiceClient(`/case/${caseId}/topic`);
        logger.info(JSON.stringify(response.data));
        if (response.data.topics) {
            return response.data.topics;
        } else {
            logger.warn(`No returned for topic for case: ${caseId}`);
            return [];
        }
    },
    'TOPICS_CASETYPE': async () => {
        const response = await infoServiceClient('/topics/MIN');
        if (response.data.parentTopics) {
            return response.data.parentTopics;
        } else {
            logger.warn(`No returned for topic for casetype: ${''}`);
            return [];
        }
    },
    'CORRESPONDENT_TYPES': async ({ caseId }) => {
        const response = await infoServiceClient('/correspondenttype');
        if (response.data.correspondentTypes) {
            return response.data.correspondentTypes;
        } else {
            logger.warn(`No correspondent types returned for case: ${caseId}`);
            return [];
        }
    },
    'CASE_CORRESPONDENTS': async ({ caseId }) => {
        const response = await caseworkServiceClient(`/case/${caseId}/correspondent`);
        if (response.data.correspondents) {
            return response.data.correspondents;
        } else {
            logger.warn(`No correspondents returned for case: ${caseId}`);
            return [];
        }
    }
};

async function getList(listName, options) {
    try {
        const list = await lists[listName.toUpperCase()].call(this, options);
        logger.debug(`Returning ${list.length} items for ${listName}`);
        return list;
    } catch (e) {
        throw new Error(`Unable to get list for ${listName}: ${e}`);
    }
}

module.exports = {
    getList,
    initialise
};