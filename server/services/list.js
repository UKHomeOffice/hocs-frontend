const User = require('../models/user');
const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { listDefinitions } = require('./lists/index');

const listRepository = {};

async function initialise() {
    const listRequests = Object.keys(listDefinitions).reduce((reducer, list) => {
        logger.info(`Fetching list: ${list}`);
        reducer.push({ list, request: fetchList(list) });
        return reducer;
    }, []);

    await listRequests.map( async ({ list, request }) => {
        try {
            const response = await request;
            handleListSuccess(list, response);
        } catch (error) {
            handleListFailure(list, error);
        }
    });
}

function fetchList(list) {
    return workflowServiceClient.get(listDefinitions[list]);
}

function handleListSuccess(listId, response) {
    logger.info(`Successfully fetched list: ${listId}`);
    listRepository[listId] = response.data[listId] || [];
}

function handleListFailure(listId, error) {
    logger.error(`Unable to retrieve list ${listId}: ${error.message}`);
}

const lists = {
    'CASE_TYPES': async ({ user }) => {
        if (listRepository.workflowTypes) {
            return listRepository.workflowTypes;
        } else {
            const list = 'workflowTypes';
            logger.info(`List ${list} unavailable, attempting to retrieve`);
            try {
                const response = await fetchList(list);
                handleListSuccess(list, response);
                return response.data.workflowTypes
                    .filter(listItem => User.hasRole(user, listItem.requiredRole));
            } catch (err) {
                handleListFailure(list, err);
            }
        }
    },
    'DOCUMENT_EXTENSION_WHITELIST': async () => {
        return DOCUMENT_WHITELIST;
    }
};

async function getList(list, options) {
    try {
        return await lists[list.toUpperCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get list for ${list}: ${e}`);
    }
}

module.exports = {
    getList,
    initialise
};