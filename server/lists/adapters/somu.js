const somuTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_SOMU_TYPE_ALL', { somuTypes: data.length });

    return data
        .map(({ uuid, caseType, type, schema, active }) => {
            return ({ key: [caseType, type], value: { uuid, caseType, type, active, schema: JSON.parse(schema) } });
        });
};

const somuItemsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_SOMU_ITEM', { somuItems: data });

    let parsedData = null;
    if (data.data && !data.deleted) {
        parsedData = JSON.parse(data.data);
    }

    return ({ uuid: data.uuid, data: parsedData, deleted: data.deleted });
};

module.exports = {
    somuTypesAdapter,
    somuItemsAdapter
};