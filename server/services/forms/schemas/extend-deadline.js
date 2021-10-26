const Form = require('../form-builder');
const { Choice, Component, ConditionChoice } = require('../component-builder');

const extendFromOptions = {
    TODAY: 'Today',
    DATE_RECEIVED: 'Date of receipt'
};

function buildActionTypeChoiceArray(rawDataArray) {
    if (rawDataArray.length > 0) {
        return rawDataArray.map(el => Choice(el.typeInfo.actionLabel, el.typeInfo.uuid));
    }
    return [];
}

function buildExtendByConditionalChoiceArray(rawExtensionArray) {

    if (rawExtensionArray.length > 0) {
        return rawExtensionArray.map(el =>
            ConditionChoice(
                'caseTypeActionUuid',
                el.typeInfo.uuid,
                Array.from(
                    { length: JSON.parse(el.typeInfo.props).extendByMaximumDays },
                    (_, i) => Choice(String(i + 1), String(i + 1)))
            )
        );
    }
    return [];
}

function buildExtendFromConditionalChoiceArray(rawExtensionArray){
    if (rawExtensionArray.length > 0) {
        return rawExtensionArray.filter(el => Object.keys(extendFromOptions).includes(JSON.parse(el.typeInfo.props).extendFrom)).map(el =>
            ConditionChoice(
                'caseTypeActionUuid',
                el.typeInfo.uuid,
                [
                    Choice(extendFromOptions[JSON.parse(el.typeInfo.props).extendFrom], JSON.parse(el.typeInfo.props).extendFrom)
                ]
            ));
    }
    return [];
}

module.exports = (options) => {

    const { caseActionData } = options;
    let extensionTypeChoiceArray;
    let extendByChoicesArray;
    let extendFromChoicesArray;

    if (caseActionData.EXTENSION) {
        extensionTypeChoiceArray = buildActionTypeChoiceArray(caseActionData.EXTENSION);
        extendByChoicesArray = buildExtendByConditionalChoiceArray(caseActionData.EXTENSION);
        extendFromChoicesArray = buildExtendFromConditionalChoiceArray(caseActionData.EXTENSION);
    }

    return Form()
        .withTitle('Apply an extension to this case')
        .withField(
            Component('dropdown', 'caseTypeActionUuid')
                .withValidator('required', 'You must select an extension type.')
                .withProp('choices', [ ...extensionTypeChoiceArray ])
                .withProp('label', 'What type of extension do you want to apply?')
                .build()
        )
        .withField(
            Component('dropdown', 'extendBy')
                .withValidator('required', 'You must select an number of days to extend the case by')
                .withProp('label', 'How many do you want to extend the case by?')
                .withProp('conditionChoices', [
                    ...extendByChoicesArray
                ])
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
        )
        .withField(
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
        )
        .build();
};
