const Form = require('../form-builder');
const { Choice, Component, ConditionChoice } = require('../component-builder');
const listService = require("../../list/service");
const uuid = require("uuid/v4");

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
                                { length: extendByMaximumDays - (option === 'TODAY' ? remainingDays : 0) },
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

function buildExtendFromConditionalChoiceArray(rawExtensionArray) {
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

async function buildReasonChoicesConditionalChoiceArray(rawExtensionArray, options) {
    if (rawExtensionArray.length > 0) {
        const listServiceInstance = listService.getInstance(uuid(), options.user);

        const results = await Promise.all(rawExtensionArray
            .map(async el => {
                const reasonChoices = JSON.parse(el.typeInfo.props).reasonChoices;
                const hydratedChoices = await listServiceInstance.fetch(reasonChoices, options);

                return ConditionChoice(
                    'caseTypeActionUuid',
                    el.typeInfo.uuid,
                    hydratedChoices.map(option =>
                        Choice(option.label, option.value)
                    )
                );
            }));

        return results;
    }
    return [];
}

module.exports = async (options) => {

    const extensionForm = Form();
    const { caseActionData } = options;

    let extensionTypeChoiceArray;
    let extendFromChoicesArray;
    let reasonChoicesArray;

    if (caseActionData.EXTENSION) {
        extensionTypeChoiceArray = buildActionTypeChoiceArray(caseActionData.EXTENSION);
        extendFromChoicesArray = buildExtendFromConditionalChoiceArray(caseActionData.EXTENSION);
        reasonChoicesArray = await buildReasonChoicesConditionalChoiceArray(caseActionData.EXTENSION, options);

        extensionForm
            .withTitle('Apply an extension to this case')
            .withField(
                Component('hidden', 'document_type')
                    .withProp('label', 'doc type')
                    .build()
            )
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
            ).withField(
                Component('checkbox-grid', 'reasons')
                    .withValidator('required', 'You must select the reasons for the extension.')
                    .withProp('label', 'Please select the reasons for the extension.')
                    .withProp('conditionChoices', [...reasonChoicesArray])
                    .build()
            );

        buildExtendByFields(caseActionData.EXTENSION, caseActionData.remainingDays, extensionForm);



        extensionForm.withField(
            Component('text-area', 'note')
                .withValidator('required', 'You must enter a note for the extension.')
                .withProp('label', 'Please enter a note for the extension.')
                .build()
        ).withField(
            Component('add-document', 'add_document')
                .withValidator('hasWhitelistedExtension')
                .withValidator('fileLimit')
                .withProp('label', 'Are there any documents to include?')
                .withProp('allowMultiple', true)
                .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
                .build()
        ).withPrimaryActionLabel('Extend Case')
            .withSecondaryAction(
                Component('backlink')
                    .withProp('label', 'Back')
                    .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                    .build()
            );

    }
    return extensionForm.withData({
        document_type: 'PIT Extension'
    }).build();
};
