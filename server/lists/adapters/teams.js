const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_TEAMS', { teams: data.length });
    return data
        .map(({ displayName, type }) => ({
            label: displayName,
            value: type
        }))
        .sort(byLabel);
};