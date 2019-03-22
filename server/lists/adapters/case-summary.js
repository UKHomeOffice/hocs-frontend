const createAdditionalFields = (additionalFields = []) => additionalFields.map(({ label, value, type }) => type === 'date' ? ({ label, value: formatDate(value) }) : ({ label, value }));

const createDeadlines = (deadlines, fromStaticList) => Object.entries(deadlines)
    .sort((a, b) => Date.parse(a[1]) > Date.parse(b[1]) ? 1 : 0)
    .map(([stageId, deadline]) => ({
        label: fromStaticList('S_STAGETYPES', stageId),
        value: formatDate(deadline)
    }));

const getActiveStages = (deadlines, fromStaticList) => deadlines
    .map(({ stage: stageId, assignedToUserUUID: userId, assignedToTeamUUID: teamId }) => ({
        stage: fromStaticList('S_STAGETYPES', stageId),
        assignedUser: fromStaticList('S_USERS', userId),
        assignedTeam: fromStaticList('S_TEAMS', teamId)
    }));

const getPrimaryTopic = (topic) => topic ? topic.label : null;

const getPrimaryCorrespondent = (correspondent) => correspondent ? correspondent.fullname : null;

const formatDate = (date) => date ? Intl.DateTimeFormat('en-GB').format(new Date(date)) : null;

module.exports = (summary, { fromStaticList }) => ({
    case: {
        received: formatDate(summary.dateReceived),
        deadline: formatDate(summary.caseDeadline)
    },
    additionalFields: createAdditionalFields(summary.additionalFields),
    primaryTopic: getPrimaryTopic(summary.primaryTopic),
    primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
    deadlines: createDeadlines(summary.deadlines, fromStaticList),
    stages: getActiveStages(summary.activeStages, fromStaticList)
});