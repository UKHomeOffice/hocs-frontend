const teamsAdapter = async (data) => data.map(({ type, displayName }) => ({ key: type, value: displayName }));

const usersAdapter = async (data) => data.map(({ id, username }) => ({ key: id, value: username }));

const caseTypesAdapter = async (data) => data.caseTypes.map(({ label, value }) => ({ key: value, value: label }));

const stageTypesAdapter = async (data) => data.stageTypes.map(({ label, value }) => ({ key: value, value: label }));

module.exports = {
    teamsAdapter,
    usersAdapter,
    caseTypesAdapter,
    stageTypesAdapter
};