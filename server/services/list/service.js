const listType = require('./types');
const { createRepository } = require('./repository');
const getLogger = require('../../libs/logger');
const User = require('../../models/user');
const { AuthenticationError, ForbiddenError } = require('../../models/error');

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
    };

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
            if (item) {
                // list items come back as:
                // a) object with 'key' and 'value' where key is the id. We return 'value' in this instance.
                // b) object with 'value' and 'label' where value is the id. We return 'label' in this instance.
                const result = item.find(item => listContains(item, key));
                if (result) {
                    return result.key ? result.value : result.label;
                }
                return defaultValue;
            } else return defaultValue;
        } else {
            return defaultValue;
        }
    };

    const listContains = (item, key) => {
        if (item.key) {
            if (Array.isArray(item.key) && Array.isArray(key)) {
                return (item.key.every(keyValue => key.includes(keyValue)));
            } else {
                return (item.key === key);
            }
        } else {
            return (item.value === key);
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
                    response = await clientInstance.get(configuredEndpoint,
                        { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });
                } catch (error) {
                    logger.error('FETCH_LIST_REQUEST_FAILURE', { list: listId, message: error.message, stack: error.stack });
                    if (error.response) {
                        if (error.response.status === 404 && defaultValue) {
                            return defaultValue;
                        } else if (error.response.status === 401) {
                            throw new AuthenticationError('You do not have permission to view this page.');
                        } else if (error.response.status === 403) {
                            throw new ForbiddenError('You are not authorised to view this page.');
                        }
                    }
                    throw new Error('Failed to request list');
                }

                //recursively get the configuration and pass this in for use in any adapters.
                var configuration = null;
                if (listId !== 'S_SYSTEM_CONFIGURATION') {
                    configuration = await fetchList('S_SYSTEM_CONFIGURATION');
                }

                const listData = await applyAdapter(response.data, adapter, { ...options, user, fromStaticList, fetchList, logger, configuration });
                if (type === listType.STATIC && listData) {
                    listCache.store(listId, listData);
                }
                return listData;
            } else {
                logger.error('LIST_NOT_IMPLEMENTED', { list: listId });
                throw new Error('List not implemented');
            }
        } catch (error) {
            if (error instanceof AuthenticationError || error instanceof ForbiddenError) {
                throw error;
            }
            logger.error('FETCH_LIST_FAILURE', { list: listId, message: error.message, stack: error.stack });
            throw new Error('Unable to fetch list');
        }
    };

    return {
        fetch: fetchList,
        getFromStaticList: fromStaticList
    };

};

const flush = async (key) => {
    getLogger().info('Flushing and retrieving new Cache ' + key);
    await cacheStaticList(key);
};

const cacheStaticList = async (listId) => {
    const { endpoint, client, adapter } = listRepository.fetch(listId);
    const clientInstance = clientRepository.fetch(client);
    const logger = getLogger();
    try {
        const response = await clientInstance.get(endpoint);
        const listData = await applyAdapter(response.data, adapter, { logger });
        listCache.flush(listId);
        listCache.store(listId, listData);
        logger.info('CACHE_STATIC_LIST_SUCCESS', { list: listId, client: client, endpoint: endpoint });
    } catch (error) {
        logger.error('CACHE_STATIC_LIST_REQUEST_FAILURE', { list: listId, status: error.response ? error.response.status : error.code });
    }
};

module.exports = {
    initialise,
    getInstance,
    flush,
    types: listType
};
