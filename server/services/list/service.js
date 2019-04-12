const listType = require('./types');
const { createRepository } = require('./repository');
const getLogger = require('../../libs/logger');
const User = require('../../models/user');

const configureEndpoint = (endpoint, data, baseUrl = '') => {
    if (data) {
        const configuredEndpoint = Object.keys(data).reduce((processed, key) => {
            const value = data[key];
            if (value) {
                const matcher = new RegExp('\\${' + key + '}', 'gi');
                return processed.replace(matcher, value);
            }
            return processed;
        }, endpoint);
        return baseUrl + configuredEndpoint;
    }
    return baseUrl + endpoint;
};

let listRepository;
let clientRepository;
let listCache;

const applyAdapter = async (response, adapter, options) => {
    if (adapter) {
        return await adapter(response, { ...options });
    }
    return response;
};

const initialise = async (lists = {}, clients = {}, initialState = {}) => {

    const logger = getLogger();

    listRepository = initialState.listRepository || createRepository();
    clientRepository = initialState.listRepository || createRepository();
    listCache = initialState.listRepository || createRepository();

    logger.debug('INITIALISE_LIST_SERVICE', { lists: Object.keys(lists).length, clients: Object.keys(clients).length });

    Object.entries(clients).forEach(([name, client]) => {
        clientRepository.store(name, client);
    });

    const handleFailure = () => {
        process.exit(1);
    }

    await Promise.all(Object.entries(lists).map(async ([listId, { endpoint, type = listType.DYNAMIC, client, adapter, data, defaultValue }]) => {
        try {
            listRepository.store(listId, { endpoint, type, client, adapter, defaultValue });
            if (type === listType.STATIC) {
                if (data) {
                    listCache.store(listId, data);
                } else {
                    const clientInstance = clientRepository.fetch(client);
                    let response;
                    try {
                        response = await clientInstance.get(endpoint);
                    } catch (error) {
                        logger.error('INITIALISE_STATIC_LIST_REQUEST_FAILURE', { list: listId, status: error.response ? error.response.status : error.code });
                        return handleFailure(listId);
                    }
                    const listData = await applyAdapter(response.data, adapter, { logger });
                    listCache.store(listId, listData);
                    logger.info('INITIALISE_STATIC_LIST_SUCCESS', { list: listId, client: client, endpoint: endpoint });
                }
            }
        } catch (error) {
            logger.error('INITIALISE_STATIC_LIST_FAILURE', { list: listId, message: error.message, stack: error.stack });
            handleFailure(listId);
        }
    }));
};

const getInstance = (requestId, user) => {

    const logger = getLogger(requestId);

    const fromStaticList = async (listId, key) => {
        const defaultValue = null;
        if (listCache.hasResource(listId)) {
            const item = await fetchList(listId);
            if(item) {
            const result = item.find(item => item.key === key);
            return result ? result.value : defaultValue;
            } else return defaultValue;
        } else {
            return defaultValue;
        }
    };

    const fetchList = async (listId, options) => {
        try {
            if (listRepository.hasResource(listId)) {
                const { endpoint, type, client, adapter, defaultValue } = listRepository.fetch(listId);
                if (type === listType.STATIC && listCache.hasResource(listId)) {
                    return listCache.fetch(listId);
                }
                const clientInstance = clientRepository.fetch(client);
                const configuredEndpoint = options ? configureEndpoint(endpoint, options) : endpoint;
                logger.info('FETCH_LIST', { list: listId, client, endpoint: configuredEndpoint });
                let response;
                try {
                    response = await clientInstance.get(configuredEndpoint, { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });
                } catch (error) {
                    logger.error('FETCH_LIST_REQUEST_FAILURE', { list: listId, message: error.message, stack: error.stack });
                    if (error.response && error.response.status === 404 && defaultValue) {
                        return defaultValue;
                    }
                    throw new Error('Failed to request list');
                }
                const listData = await applyAdapter(response.data, adapter, { ...options, user, fromStaticList, logger });
                if (type === listType.STATIC && listData) {
                    listCache.store(listId, listData);
                }
                return listData;
            } else {
                logger.error('LIST_NOT_IMPLEMENTED', { list: listId });
                throw new Error('List not implemented');
            }
        } catch (error) {
            logger.error('FETCH_LIST_FAILURE', { list: listId, message: error.message, stack: error.stack });
            throw new Error('Unable to fetch list');
        }
    };

    return {
        fetch: fetchList,
        getFromStaticList: fromStaticList
    };

};

const flush = (key) => listCache.flush(key);

module.exports = {
    initialise,
    getInstance,
    flush,
    types: listType
};