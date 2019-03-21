const listType = require('./types');
const { createRepository } = require('./repository');
const logger = require('../libs/logger');
const User = require('../models/user');

const configureEndpoint = (endpoint, data, baseUrl = '') => {
    if (data) {
        const configuredEndpoint = Object.keys(data).reduce((processed, key) => {
            const value = data[key];
            if (value) {
                const matcher = new RegExp(/${key}/gi);
                processed.replace(matcher, value);
            }
            return processed;
        }, endpoint);
        return baseUrl + configuredEndpoint;
    }
    return baseUrl + endpoint;
};

const listRepository = createRepository();
const clientRepository = createRepository();
const listCache = createRepository();

const initialise = async ({ Lists = {}, Clients = {} }) => {

    logger.debug({ event_id: 'INITIALISE_LIST_SERVICE', clients: Object.keys(Clients).length, lists: Object.keys(Lists).length });

    Object.entries(Clients).forEach(([name, client]) => {
        clientRepository.store(name, client);
    });

    await Object.entries(Lists).forEach(async ([id, { Endpoint, Type = listType.DYNAMIC, Client, Adapter, Data }]) => {
        listRepository.store(id, { Endpoint, Type, Client, Adapter });
        if (Type === listType.STATIC) {
            if (Data) {
                listCache.store(id, Data);
            } else {
                try {
                    const client = clientRepository.fetch(Client);
                    const { data } = await client.get(Endpoint);
                    if (data) {
                        const processedData = Adapter ? Adapter(data) : data;
                        listCache.store(id, processedData);
                        logger.debug({ event_id: 'FETCH_STATIC_LIST_SUCCESS', list: id, client: Client, endpoint: Endpoint });
                    }
                } catch (error) {
                    logger.error({ event_id: 'FETCH_STATIC_LIST_FAILURE', status: error.response ? error.response.status : null });
                    listCache.store(id, null);
                }
            }
        }
    });

};

const fetchList = (requestId, user) => async (id, options) => {

    const handleFailure = () => {
        logger.error({ requestId, event_id: 'FETCH_LIST_RETURN_EMPTY' });
        return [];
    };

    const handleSuccess = async (response, adapter, options) => {
        logger.debug({ requestId, event_id: 'FETCH_LIST_SUCCESS', count: Array.isArray(response) ? response.length : 'N/A' });
        if (adapter) {
            return await adapter(response, {
                ...options, user,
                fromStaticList: fromStaticList(requestId)
            });
        }
        return response;
    };

    try {
        if (listRepository.hasResource(id)) {
            const list = listRepository.fetch(id);
            if (list.Type === listType.STATIC && listCache.hasResource(id)) {
                return listCache.fetch(id);
            }
            logger.info({ requestId, event_id: 'FETCH_LIST', list: id, client: list.Client, endpoint: list.Endpoint });
            const client = clientRepository.fetch(list.Client);
            const endpoint = options ? configureEndpoint(list.Endpoint, options) : list.Endpoint;
            const { data } = await client.get(endpoint, { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });
            if (list.Type === listType.STATIC && data) {
                listCache.store(id, data);
            }
            return await handleSuccess(data, list.Adapter, options);
        } else {
            logger.error({ requestId, event_id: 'LIST_NOT_IMPLEMENTED', list: id });
            return handleFailure();
        }
    } catch (error) {
        logger.error({ requestId, event_id: 'FETCH_LIST_FAILURE', stack: error.stack, list: id, options: JSON.stringify(options) });
        return handleFailure();
    }

};

const fromStaticList = (requestId) => async (list, key) => {
    const defaultValue = null;
    if (listCache.hasResource(list)) {
        const item = await fetchList(requestId)(list);
        const result = item.find(item => item.key === key);
        return result ? result.value : defaultValue;
    } else {
        return defaultValue;
    }
};

module.exports = {
    init: initialise,
    fetchList,
    fromStaticList,
    types: listType
};