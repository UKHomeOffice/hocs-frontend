const teamsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_TEAMS', { teams: data.length });
    return data.map(({ type, displayName }) => ({ key: type, value: displayName }));
};

const usersAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_USERS', { users: data.length });
    return data.map(({ id, username }) => ({ key: id, value: username }));
};

const caseTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_CASETYPES', { caseTypes: data.caseTypes.length });
    return data.caseTypes.map(({ label, value }) => ({ key: value, value: label }));
};

const stageTypesAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_STAGETYPE', { stageTypes: data.stageTypes.length });
    return data.stageTypes.map(({ label, value }) => ({ key: value, value: label }));
};

module.exports = {
    teamsAdapter,
    usersAdapter,
    caseTypesAdapter,
    stageTypesAdapter
};
