const somuTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_SOMU_TYPE_ALL', { somuTypes: data.length });

    return data
        .map(({ uuid, caseType, type, schema, active }) => {
            return ({ key: [caseType, type], value: { uuid, caseType, type, active, schema: JSON.parse(schema) } });
        });
};

const somuItemsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_SOMU_ITEM', { somuItems: data });

    if (data && Array.isArray(data)) {
        const somuItems = data.map(({ uuid, data, deleted }) => {
            return ({ uuid, data: JSON.parse(data), deleted });
        });

        return somuItems;
    }

    return [];
};

module.exports = {
    somuTypesAdapter,
    somuItemsAdapter
};
