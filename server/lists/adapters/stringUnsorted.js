module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_STRING_UNSORTED', { strings: data.length });
    return data
        .map(d => ({
            label: d,
            value: d
        }));
};