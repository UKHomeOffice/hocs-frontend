const byCountry = (a, b) => {
    if (a && a.label && a.label.toUpperCase() === 'UNITED KINGDOM') return -1;
    if (b && b.label && b.label.toUpperCase() === 'UNITED KINGDOM') return +1;
    return a.label.localeCompare(b.label);
};

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_COUNTRY_SORT', { strings: data.length });
    return data
        .map(d => ({
            label: d,
            value: d
        }))
        .sort(byCountry);
};