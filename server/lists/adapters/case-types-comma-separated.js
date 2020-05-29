const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_TYPES_AS_COMMA_SEPARATED_LIST', { caseTypes: data.length });
    return data
        .sort(byLabel)
        .map(({ value }) => value).join(',');
};