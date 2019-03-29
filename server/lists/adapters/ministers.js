const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_MINISTERS', { ministers: data.ministers.length });
    return data.ministers.sort(byLabel);
};