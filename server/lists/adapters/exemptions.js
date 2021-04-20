const caseExemptionsAllAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_EXEMPTIONS_ALL', { exemptions: data.length });

    return data.exemptions;
};

module.exports = {
    caseExemptionsAllAdapter
};