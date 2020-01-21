const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_STRING_SORTED', { strings: data.length });
    return data
        .map(d => ({
            label: d,
            value: d
        }))
        .sort(byLabel);
};