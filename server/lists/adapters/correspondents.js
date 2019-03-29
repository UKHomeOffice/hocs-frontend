const byLabel = (a, b) => a.label.localeCompare(b.label);

const caseCorrespondentAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_CORRESPONDENTS', { correspondents: data.length });
    return data.correspondents.map(({ fullname, uuid }) => ({ label: fullname, value: uuid })).sort(byLabel);
};

const correspondentTypeAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CORRESPONDENT_TYPES', { types: data.length });
    return data.correspondentTypes.map(({ type, displayName }) => ({ label: displayName, value: type })).sort(byLabel);
};

module.exports = {
    caseCorrespondentAdapter,
    correspondentTypeAdapter
};