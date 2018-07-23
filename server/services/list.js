const User = require('../models/user');
const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

const listRepository = {};

const listDefinitions = {
    workflowTypes: '/workflow'
};

function initialise() {
    const listRequests = Object.keys(listDefinitions).reduce((reducer, list) => {
        logger.info(`Fetching list: ${list}`);
        reducer.push({ list, request: fetchList(list) });
        return reducer;
    }, []);

    listRequests.map(({ list, request }) => {
        request
            .then(response => {
                handleListSuccess(list, response);
            })
            .catch(err => {
                handleListFailure(list, err);
            });
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
    'case_type': async ({ user }) => {
        if (listRepository.workflowTypes) {
            return listRepository.workflowTypes
                .filter(listItem => User.hasRole(user, listItem.requiredRole));
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
    'document_extension_whitelist': () => {
        return Promise.resolve(DOCUMENT_WHITELIST.split(','));
    }
};

function getList(field, options) {
    try {
        return lists[field.toLowerCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get list for ${field}: ${e}`);
    }
}

initialise();

module.exports = {
    getList
};