const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

function buildActionTypeChoiceArray(rawDataArray) {
    if (rawDataArray.length > 0) {
        return rawDataArray.map(el => Choice(el.typeInfo.actionLabel, el.typeInfo.uuid));
    }
    return [];
}

function buildVisibilityConditionsValuesString(interestTypeArray) {
    return interestTypeArray
        .map(appealType => appealType.typeInfo.uuid).join();
}

function buildInterestChoices(interestTypeArray) {
    return interestTypeArray
        .filter(interestType => JSON.parse(interestType.typeInfo.props).interestChoices)
        .map(interestType => {
            return {
                choices: JSON.parse(interestType.typeInfo.props).interestChoices,
                conditionPropertyName: 'caseTypeActionUuid',
                conditionPropertyValue: interestType.typeInfo.uuid
            };
        });
}

module.exports = async options => {

    const { caseId, stageId } = options;

    const { EXTERNAL_INTEREST } = options.caseActionData;
    let extensionTypeChoiceArray;
    let visibilityConditionsValueString;
    let interestChoices;

    if (EXTERNAL_INTEREST) {
        extensionTypeChoiceArray = buildActionTypeChoiceArray(EXTERNAL_INTEREST);
        visibilityConditionsValueString = buildVisibilityConditionsValuesString(EXTERNAL_INTEREST);
        interestChoices = buildInterestChoices(EXTERNAL_INTEREST);
    }


    return Form()
        .withTitle('Add Interest')
        .withPrimaryActionLabel('Add Interest')
        .withField(
            Component('dropdown', 'caseTypeActionUuid')
                .withValidator('required', 'You must select an interest type.')
                .withProp('choices', [ ...extensionTypeChoiceArray ])
                .withProp('label', 'What type of interest do you want to record?')
                .build()
        )
        .withField(
            Component('dropdown', 'interestedPartyType')
                .withValidator('required')
                .withProp('label', 'Interested party')
                .withProp('conditionChoices', interestChoices)
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
            Component('text-area', 'detailsOfInterest')
                .withProp('label', 'Details of Interest')
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action',
                    `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withPrimaryActionLabel('Add')
        .build();
};
