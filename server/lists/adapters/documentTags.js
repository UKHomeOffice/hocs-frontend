module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_DOCUMENT_TAGS', { types: data.length });
    return data.map(item => ({ label: item, value: item }));
};