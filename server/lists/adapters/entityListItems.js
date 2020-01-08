module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_ENTITY_LIST_ITEMS', { strings: data.length });
    return data
        .map(d => ({
            label: d.data.title,
            value: d.simpleName
        }));
};