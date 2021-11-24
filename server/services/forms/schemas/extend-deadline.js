const Form = require('../form-builder');
const { Choice, Component, ConditionChoice } = require('../component-builder');

const extendFromOptions = {
    TODAY: 'Today',
    CURRENT_DEADLINE: 'Current deadline'
};

function buildActionTypeChoiceArray(rawDataArray) {
    if (rawDataArray.length > 0) {
        return rawDataArray.map(el => Choice(el.typeInfo.actionLabel, el.typeInfo.uuid));
    }
    return [];
}

function buildExtendByFields(rawExtensionArray, remainingDays, finalForm) {

    rawExtensionArray.filter(type => Object.keys(extendFromOptions)
        .filter(option => JSON.parse(type.typeInfo.props).extendFrom.includes(option))
    ).forEach(type => finalForm
        .withField(
            Component('dropdown', 'extendBy')
                .withValidator('required')
                .withValidator('required', 'You must select an number of working days to extend the case by')
                .withProp('label', 'How many working days do you want to extend the case by?')
                .withProp('hint', 'Options that would bring the deadline date forward are not shown. If there are no options to choose, then the case cannot be extended at this time. Please press \'Back\' in this instance.')
                .withProp('conditionChoices', JSON.parse(type.typeInfo.props).extendFrom.map(
                    option => {
                        const extendByMaximumDays = JSON.parse(type.typeInfo.props).extendByMaximumDays;
                        return ConditionChoice(
                            'extendFrom',
                            option,
                            Array.from(
                                { length: extendByMaximumDays - ( option === 'TODAY' ? remainingDays : 0) },
                                (_, i) =>
                                    Choice(
                                        String(option === 'TODAY' ? remainingDays + i + 1 : i + 1),
                                        String(option === 'TODAY' ? remainingDays + i : 1 + i))
                            ));
                    })
                )
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'caseTypeActionUuid',
                        'conditionPropertyValue': type.typeInfo.uuid
                    }
                ])
                .build()
        )
    );
}

function buildExtendFromConditionalChoiceArray(rawExtensionArray){
    if (rawExtensionArray.length > 0) {
        return rawExtensionArray
            .filter(type => Object.keys(extendFromOptions)
                .filter(option => JSON.parse(type.typeInfo.props).extendFrom.includes(option)))
            .map(el =>
                ConditionChoice(
                    'caseTypeActionUuid',
                    el.typeInfo.uuid,
                    JSON.parse(el.typeInfo.props).extendFrom.map(option =>
                        Choice(extendFromOptions[option], option)
                    )
                ));
    }
    return [];
}

module.exports = (options) => {

    const extensionForm = Form();
    const { caseActionData } = options;
    let extensionTypeChoiceArray;
    let extendFromChoicesArray;

    if (caseActionData.EXTENSION) {
        extensionTypeChoiceArray = buildActionTypeChoiceArray(caseActionData.EXTENSION);
        extendFromChoicesArray = buildExtendFromConditionalChoiceArray(caseActionData.EXTENSION);


        extensionForm
            .withTitle('Apply an extension to this case')
            .withField(
                Component('dropdown', 'caseTypeActionUuid')
                    .withValidator('required', 'You must select an extension type.')
                    .withProp('choices', [...extensionTypeChoiceArray])
                    .withProp('label', 'What type of extension do you want to apply?')
                    .build()
            )
            .withField(
                Component('dropdown', 'extendFrom')
                    .withValidator('required', 'You must select when the extension will start from.')
                    .withProp('label', 'Case will be extended from:')
                    .withProp('conditionChoices', [
                        ...extendFromChoicesArray
                    ])
                    .build()
            );

        buildExtendByFields(caseActionData.EXTENSION, caseActionData.remainingDays, extensionForm);

        extensionForm.withField(
            Component('text-area', 'note')
                .withValidator('required', 'You must enter a reason for the extension.')
                .withProp('label', 'Please enter a reason for the extension.')
                .build()
        )
            .withPrimaryActionLabel('Extend Case')
            .withSecondaryAction(
                Component('backlink')
                    .withProp('label', 'Back')
                    .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                    .build()
            );

    }
    return extensionForm.build();
};
