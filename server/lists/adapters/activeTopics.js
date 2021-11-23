const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_ONLY_ACTIVE_TOPICS', { topics: data.parentTopics.length });
    return data.parentTopics
        .map(parent => {
            parent.options = parent.options.filter(option => option.active===true).sort(byLabel);
            return parent;
        })
        .sort(byLabel);
};