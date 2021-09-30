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
        assignedTeam: await fromStaticList('S_TEAMS', teamId, true)
    })));

const getPrimaryTopic = (topic) => topic ? topic.label : null;

const getPrimaryCorrespondent = correspondent => correspondent && getCorrespondentDetails(correspondent);

const getCorrespondentDetails = correspondent => {
    const { fullname, address, email } = correspondent;
    return Object.fromEntries(Object.entries({ fullname, address, email }).filter(([_, v]) => v != null));
};

const getPreviousCase = previousCase => {
    if (previousCase && previousCase.caseUUID && previousCase.caseReference && previousCase.stageUUID){
        return { uuid: previousCase.caseUUID, reference: previousCase.caseReference, stageUuid: previousCase.stageUUID };
    } else {
        return undefined;
    }
};

function hydrateSomu(somuItems, fetchList) {
    return somuItems.map(type => {
        const mappedItems = type.items.map(item => {
            const hydratedSomuItem = {};
            Object.keys(item).forEach(
                async key => {
                    const choices = type.schema.fields.find(field => field.name === key).choices;
                    if(choices) {
                        let foundOption;
                        if(typeof choices === 'string') {
                            const resolvedChoices = await fetchList(choices);
                            foundOption = resolvedChoices.filter(option => option.value === item[key]);
                        } else {
                            foundOption = choices.filter(option => option.value === item[key]);
                        }

                        if (foundOption && foundOption.length === 1) {
                            item[key] = foundOption[0].label;
                        }
                    }

                    if (type.schema.categoriseBy === key) {
                        hydratedSomuItem['heading'] = item[key];
                    } else {
                        const newKey = (type.schema.fields.find(field => field.name === key)).extractColumnLabel;
                        hydratedSomuItem[newKey] = item[key];
                    }
                }
            );

            return hydratedSomuItem;
        });

        return { ...type, items: mappedItems };
    });
}

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
            deadline: formatDate(summary.caseDeadline),
            deadLineExtensions: summary.deadLineExtensions
        },
        additionalFields: await createAdditionalFields(summary.additionalFields, fetchList),
        primaryTopic: getPrimaryTopic(summary.primaryTopic),
        primaryCorrespondent: getPrimaryCorrespondent(summary.primaryCorrespondent),
        deadlinesEnabled: deadlinesEnabled,
        deadlines: deadlinesEnabled && stageDeadlineEnabled && summary.stageDeadlines ? await createDeadlines(summary.stageDeadlines, fromStaticList) : null,
        stages: await getActiveStages(summary.activeStages, fromStaticList),
        previousCase: getPreviousCase(summary.previousCase),
        somuItems: hydrateSomu(summary.somuItems, fetchList)
    };
};
