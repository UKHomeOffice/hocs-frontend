const getUser = (id, users) => {
    const user = users.find(user => user.id === id);
    return user ? user.email : null;
};

const getTeam = (id, teams) => {
    const team = teams.find(team => team.type === id);
    return team ? team.displayName : null;
};

const getStage = (id, stages) => {
    const stage = stages.find(stage => stage.value === id);
    return stage ? stage.label : null;
};

const createAdditionalFields = (additionalFields = []) => additionalFields.map(({ label, value, type }) => type === 'date' ? ({ label, value: formatDate(value) }) : ({ label, value }));
const createDeadlines = (deadlines, stageTypes) => Object.entries(deadlines)
    .sort((first, second) => (first[1] > second[1]) ? 1 : -1)
    .map(([stageId, deadline]) => ({
        label: getStage(stageId, stageTypes),
        value: formatDate(deadline)
    }));
const getActiveStages = (deadlines, users, teams, stages) => deadlines
    .map(({ stage: stageId, assignedToUserUUID: userId, assignedToTeamUUID: teamId }) => ({
        stage: getStage(stageId, stages),
        assignedUser: getUser(userId, users),
        assignedTeam: getTeam(teamId, teams)
    }));

const getPrimaryTopic = (topic) => topic ? topic.label : null;
const getPrimaryCorrespondent = (correspondent) => correspondent ? correspondent.fullname : null;

const formatDate = (date) => date ? Intl.DateTimeFormat('en-GB').format(new Date(date)) : null;

module.exports = (summary, { getStaticList }) => ({
    case: {
        received: formatDate(summary.DateReceived),
        deadline: formatDate(summary.caseDeadline)
    },
    additionalFields: createAdditionalFields(summary.additionalFields),
    primaryTopic: getPrimaryTopic(summary.primaryTopic),
    primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
    deadlines: createDeadlines(summary.deadlines, getStaticList('S_STAGETYPES')),
    stages: getActiveStages(summary.activeStages, getStaticList('S_USERS'), getStaticList('S_TEAMS'), getStaticList('S_STAGETYPES'))
});