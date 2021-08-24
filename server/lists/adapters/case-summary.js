const { caseworkService } = require('../../clients');
const User = require('../../models/user');
const { formatDate } = require('../../libs/dateHelpers');

const createAdditionalFields = async (additionalFields = [], fetchList) => {
    const results = additionalFields
        .map(field => formatValueOnType(field));

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

const formatValueOnType = ({ label, value, type, choices }) => {
    switch (type) {
        case 'date':
            return { label, value: formatDate(value), choices };
        case 'checkbox':
            return { label, value: formatCheckboxValue(value), choices };
        default:
            return { label, value, choices };
    }
};

const formatCheckboxValue = (value) => {
    return value.replace(/,/g, ', ');
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

module.exports = async (summary, options) => {
    const { fromStaticList, fetchList, configuration, user } = options;
    const { data: caseProfile } = await caseworkService.get(`/case/profile/${options.caseId}`, { headers: User.createHeaders(user) });
    const stageDeadlineEnabled = caseProfile && caseProfile.summaryDeadlineEnabled;
    const deadlinesEnabled = configuration.deadlinesEnabled;
    return {
        case: {
            created: formatDate(summary.caseCreated),
            received: formatDate(summary.dateReceived),
            deadline: formatDate(summary.caseDeadline)
        },
        additionalFields: await createAdditionalFields(summary.additionalFields, fetchList),
        primaryTopic: getPrimaryTopic(summary.primaryTopic),
        primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
        deadlinesEnabled: deadlinesEnabled,
        deadlines: deadlinesEnabled && stageDeadlineEnabled && summary.stageDeadlines ? await createDeadlines(summary.stageDeadlines, fromStaticList) : null,
        stages: await getActiveStages(summary.activeStages, fromStaticList),
        previousCaseReference: summary.previousCaseReference
    };
};
