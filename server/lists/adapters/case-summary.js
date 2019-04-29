const createAdditionalFields = (additionalFields = []) => additionalFields.map(({ label, value, type }) => type === 'date' ? ({ label, value: formatDate(value) }) : ({ label, value }));

const createDeadlines = async (deadlines, fromStaticList) => await Promise.all(Object.entries(deadlines)
    .sort((a, b) => Date.parse(a[1]) > Date.parse(b[1]) ? 1 : 0)
    .map(async ([stageId, deadline]) => ({
        label: await fromStaticList('S_STAGETYPES', stageId),
        value: formatDate(deadline)
    })));

const getActiveStages = async (deadlines, fromStaticList) => await Promise.all(deadlines
    .map(async ({ stage: stageId, assignedToUserUUID: userId, assignedToTeamUUID: teamId }) => ({
        stage: await fromStaticList('S_STAGETYPES', stageId),
        assignedUser: await fromStaticList('S_USERS', userId),
        assignedTeam: await fromStaticList('S_TEAMS', teamId)
    })));

const getPrimaryTopic = (topic) => topic ? topic.label : null;

const getPrimaryCorrespondent = (correspondent) => correspondent ? correspondent.fullname : null;

const parseDate = (rawDate) => {
    const [date] = rawDate.match(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const formatDate = (date) => date ? parseDate(date) : null;

module.exports = async (summary, { fromStaticList }) => ({
    case: {
        received: formatDate(summary.dateReceived),
        deadline: formatDate(summary.caseDeadline)
    },
    additionalFields: createAdditionalFields(summary.additionalFields),
    primaryTopic: getPrimaryTopic(summary.primaryTopic),
    primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
    deadlines: summary.stageDeadlines ? await createDeadlines(summary.stageDeadlines, fromStaticList) : null,
    stages: await getActiveStages(summary.activeStages, fromStaticList)
});