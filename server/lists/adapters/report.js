const adapter = async (data, { logger }) => {
    logger.debug('REQUEST_REPORTS', { report_types: data.length });
    return data.map(report => ({ key: report.slug, value: report }));
};

module.exports = {
    adapter
};
