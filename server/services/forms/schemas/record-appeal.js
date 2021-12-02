const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');


function buildAppealTypeChoices(appealTypeArray) {
    return appealTypeArray
        .filter(type => type.typeData.filter(data => data.status !== 'Complete').length < type.typeInfo.maxConcurrentEvents)
        .map(type => Choice(type.typeInfo.actionLabel, type.typeInfo.uuid));
}


function buildVisibilityConditionsValuesString(appealTypeArray) {
    return appealTypeArray
        .filter(appealType => JSON.parse(appealType.typeInfo.props).appealOfficerData)
        .map(appealType => appealType.typeInfo.uuid).join();
}

function buildDirectorateChoices(appealTypeArray) {
    return appealTypeArray
        .filter(appealType => JSON.parse(appealType.typeInfo.props).appealOfficerData)
        .map(appealType => {
            return {
                choices: JSON.parse(appealType.typeInfo.props).appealOfficerData.directorate.choices,
                conditionPropertyName: 'caseTypeActionUuid',
                conditionPropertyValue: appealType.typeInfo.uuid
            };});
}

function buildOfficerChoices(appealTypeArray) {
    return appealTypeArray
        .filter(appealType => JSON.parse(appealType.typeInfo.props).appealOfficerData)
        .map(appealType => {
            return {
                choices: JSON.parse(appealType.typeInfo.props).appealOfficerData.officer.choices,
                conditionPropertyName: 'caseTypeActionUuid',
                conditionPropertyValue: appealType.typeInfo.uuid
            };
        });
}

module.exports = async options => {

    const { APPEAL } = options.caseActionData;

    const appealTypeChoices = buildAppealTypeChoices(APPEAL);
    const visibilityConditionsValueString = buildVisibilityConditionsValuesString(APPEAL);
    const directorateChoices = buildDirectorateChoices(APPEAL);
    const officerChoices = buildOfficerChoices(APPEAL);

    return Form()
        .withTitle('Appeals')
        .withPrimaryActionLabel('Add Appeal')
        .withField(
            Component('heading', 'log-an-appeal-heading')
                .withProp('label', 'Add an appeal')
                .build()
        ).withField(
            Component('dropdown', 'caseTypeActionUuid')
                .withValidator('required')
                .withProp('label', 'Which type of appeal needs to be applied?')
                .withProp('choices', [ ...appealTypeChoices ])
                .build()
        )
        .withField(
            Component('dropdown', 'directorate')
                .withValidator('required')
                .withProp('label', 'Directorate')
                .withProp('conditionChoices', directorateChoices)
                .withValidator('required', 'Directorate is required')
                .withProp('visibilityConditions', [
                    {
                        'function': 'hasCommaSeparatedValue',
                        'conditionArgs': [{
                            'conditionPropertyName': 'caseTypeActionUuid',
                            'conditionPropertyValue': visibilityConditionsValueString
                        }]
                    }
                ])
                .build()
        ).withField(
            Component('dropdown', 'officer')
                .withValidator('required')
                .withProp('label', 'Officer')
                .withProp('conditionChoices', officerChoices )
                .withValidator('required', 'An officer is required')
                .withProp('visibilityConditions', [
                    {
                        'function': 'hasCommaSeparatedValue',
                        'conditionArgs': [{
                            'conditionPropertyName': 'caseTypeActionUuid',
                            'conditionPropertyValue': visibilityConditionsValueString
                        }]
                    }
                ])
                .build()
        )
        .withField(
            Component('hidden', 'status')
                .withProp('label', 'Has this been completed?')
                .build()
        )
        .withField(
            Component('hidden', 'document_type')
                .withProp('label', 'doc type')
                .build()
        )
        .withData({
            status: 'Pending',
            document_type: 'Appeal Response'
        })
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/?tab=FOI_ACTIONS`)
                .build()
        )
        .withPrimaryActionLabel('Add Appeal')
        .build();

};
