const teamsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_TEAMS', { teams: data.length });
    return data.map(({ type, displayName }) => ({ key: type, value: displayName }));
};

const usersAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_USERS', { users: data.length });
    return data.map(({ id, username }) => ({ key: id, value: username }));
};

const caseTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASETYPES', { caseTypes: data.length });
    return data.map(({ label, value }) => ({ key: value, value: label }));
};

const stageTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_STAGETYPE', { stageTypes: data.length });
    return data.map(({ label, value }) => ({ key: value, value: label }));
};

const documentTagsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_DOCUMENT_TAGS', { types: data.documentLabels.length });
    return data.documentLabels.map(item => ({ label: item, value: item }));
};

module.exports = {
    teamsAdapter,
    usersAdapter,
    caseTypesAdapter,
    stageTypesAdapter,
    documentTagsAdapter
};