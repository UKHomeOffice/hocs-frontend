const teamsAdapter = async (data, { logger }) => {
    logger.debug('REQUEST_TEAMS', { teams: data.length });
    return data.map(({ type, displayName }) => ({ key: type, value: displayName }));
};

const prepareDisplayName = ({ type, displayName, active }) => {
    const label = active ? displayName : displayName+' (Deactivated)';
    return { key: type, value: label };
};

const teamsAdapterAllTeams = async (data, { logger }) => {
    logger.debug('REQUEST_TEAMS_ALL', { teams: data.length });
    return data.map(prepareDisplayName);
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

module.exports = {
    teamsAdapter,
    teamsAdapterAllTeams,
    usersAdapter,
    caseTypesAdapter,
    stageTypesAdapter
};