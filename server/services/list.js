const User = require('../models/user');
const { DOCUMENT_WHITELIST } = require('../config').forContext('server');
const { workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

const listRepository = {};

const listDefinitions = {
    workflowTypes: '/workflow'
};

const initialise = () => {
    const listRequests = Object.keys(listDefinitions).reduce((reducer, list) => {
        logger.info(`Fetching list: ${list}`);
        reducer.push({ list, request: workflowServiceClient.get(listDefinitions[list]) });
        return reducer;
    }, []);

    listRequests.map(({ list, request }) => {
        request
            .then(response => {
                logger.info(`Successfully fetched list: ${list}`);
                listRepository[list] = response.data[list];
            })
            .catch(err => {
                logger.error(`Unable to retrieve list ${list}: ${err.message}`);
            });
    });
};

const lists = {
    'case_type': ({ user }) => {
        if (listRepository.workflowTypes) {
            return listRepository.workflowTypes.filter(listItem => User.hasRole(user, listItem.requiredRole));
        } else {
            return [];
        }
    },
    'document_extension_whitelist': () => {
        return DOCUMENT_WHITELIST.split(',');
    }
};

const getList = (field, options) => {
    try {
        return lists[field.toLowerCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get list for ${field}: ${e}`);
    }
};

initialise();

module.exports = {
    getList
};