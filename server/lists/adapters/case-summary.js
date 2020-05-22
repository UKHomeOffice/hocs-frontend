
const createAdditionalFields = async (additionalFields = [], fetchList) => {
    var results = additionalFields.map(({ label, value, type, choices }) => type === 'date' ? ({ label, value: formatDate(value), choices }) : ({ label, value, choices }));

    for (var i = 0; i < results.length; i++) {
        var field = results[i];
        if (field.choices && typeof field.choices === 'string') {
            field.choices = await fetchList(field.choices);
        }
        if (field.choices) {
            for (var j = 0; j < field.choices.length; j++) {
                const choice = field.choices[j];
                if (choice.value && choice.value === field.value) {
                    field.value = choice.label;
                    break;
                }
            }
        }
    }
    return results;
};

const createDeadlines = async (deadlines, fromStaticList) => await Promise.all(Object.entries(deadlines)
    .sort((a, b) => Date.parse(a[1]) - Date.parse(b[1]))
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

const getPrimaryCorrespondent = correspondent => correspondent && { address: correspondent.address, fullname: correspondent.fullname };

const parseDate = (rawDate) => {
    const [date] = rawDate.match(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const formatDate = (date) => date ? parseDate(date) : null;

module.exports = async (summary, { fromStaticList, fetchList, configuration }) => ({
    case: {
        created: formatDate(summary.caseCreated),
        received: formatDate(summary.dateReceived),
        deadline: formatDate(summary.caseDeadline)
    },
    additionalFields: await createAdditionalFields(summary.additionalFields, fetchList),
    primaryTopic: getPrimaryTopic(summary.primaryTopic),
    primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
    deadlinesEnabled: configuration.deadlinesEnabled,
    deadlines: configuration.deadlinesEnabled && summary.stageDeadlines ? await createDeadlines(summary.stageDeadlines, fromStaticList) : null,
    stages: await getActiveStages(summary.activeStages, fromStaticList)
});