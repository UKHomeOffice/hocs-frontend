const { caseworkService } = require('../../clients');
const User = require('../../models/user');
const { formatDate } = require('../../libs/dateHelpers');
const toTitleCase = require('../../libs/titleCaseHelper');
const { actionSummaryAdapterFactory } = require('./actions/actionsSummaryAdapterFactory');
const { resolveDeadlineDisplayWithDateFormatting } = require('../../libs/deadlineDisplayHelpers');

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
                if (choice.options) {
                    const foundOption = choice.options.filter(option => option.value === field.value);
                    if (foundOption && foundOption.length === 1) {
                        field.value = foundOption[0].label;
                        break;
                    }
                }
                if (choice.value && choice.value === field.value) {
                    field.value = choice.label;
                    break;
                }
            }
        }
    }
    return results;
};

const formatCaseActions = async (caseActions, fetchList) => Promise.all(
    Object.keys(caseActions.caseActionData).map(
        async key => {
            return {
                title: toTitleCase(key),
                type: key,
                items: await actionSummaryAdapterFactory(key, caseActions, fetchList)
            };
        }
    )).catch(() => {});

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
    }))).catch(() => {});

const getActiveStages = async (deadlines, fromStaticList) => await Promise.all(deadlines
    .map(async ({ stage: stageId, assignedToUserUUID: userId, assignedToTeamUUID: teamId }) => ({
        stage: await fromStaticList('S_STAGETYPES', stageId),
        assignedUser: await fromStaticList('S_USERS', userId),
        assignedTeam: await fromStaticList('S_TEAMS', teamId)
    }))).catch(() => {});

const getPrimaryTopic = (topic) => topic ? topic.label : null;

const getPrimaryCorrespondent = correspondent => correspondent && getCorrespondentDetails(correspondent);

const getCorrespondentDetails = correspondent => {
    const { fullname, organisation, address, email, telephone, reference } = correspondent;
    return Object.fromEntries(Object.entries({ fullname, organisation, address, email, telephone, reference }).filter(([_, v]) => v != null));
};

const getPreviousCase = previousCase => {
    if (previousCase && previousCase.caseUUID && previousCase.caseReference && previousCase.stageUUID){
        return { uuid: previousCase.caseUUID, reference: previousCase.caseReference, stageUuid: previousCase.stageUUID };
    } else {
        return undefined;
    }
};

module.exports = async (summary, options) => {
    const { fromStaticList, fetchList, configuration, user } = options;
    const { data: caseProfile } = await caseworkService.get(`/case/profile/${options.caseId}`, { headers: User.createHeaders(user) });
    const stageDeadlineEnabled = caseProfile && caseProfile.summaryDeadlineEnabled;
    const deadlinesEnabled = configuration.deadlinesEnabled;
    return {
        type: summary.type,
        case: {
            created: formatDate(summary.caseCreated),
            received: formatDate(summary.dateReceived),
            deadline: resolveDeadlineDisplayWithDateFormatting(summary.caseDeadline, summary.suspended),
            deadLineExtensions: summary.deadLineExtensions
        },
        additionalFields: await createAdditionalFields(summary.additionalFields, fetchList),
        primaryTopic: getPrimaryTopic(summary.primaryTopic),
        primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
        deadlinesEnabled: deadlinesEnabled,
        deadlines: deadlinesEnabled && stageDeadlineEnabled && summary.stageDeadlines ? await createDeadlines(summary.stageDeadlines, fromStaticList) : null,
        stages: await getActiveStages(summary.activeStages, fromStaticList),
        previousCase: getPreviousCase(summary.previousCase),
        actions: summary.actions ? await formatCaseActions(summary.actions, fetchList) : undefined
    };
};
