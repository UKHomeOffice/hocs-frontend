const uuid = require('uuid/v4');
const logger = require('../libs/logger');

const actions = {
    create: (data) => {
        // TODO: Post to create case
        const stage = 'document';
        return {
            callbackUrl: `/case/${uuid()}/${stage}`
        }
    },
    document: (data) => {
        // TODO: Post to persist case
        return {
            callbackUrl: '/'
        }
    }
};

const performAction = (action, data) => {
    try {
        logger.debug(`Calling action for ${action} - ${JSON.stringify(data)}`);
        return actions[action.toLowerCase()].call(this, data);
    } catch (e) {
        throw new Error(`Unable to perform action ${action}`);
    }
};

module.exports = {
    performAction
};