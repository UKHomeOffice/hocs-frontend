const Form = require('../form-builder');

const { Component, Choice } = require('../component-builder');

function buildSuspensionType(suspensionTypeArray) {
    return suspensionTypeArray
        .filter(type => type.typeData.filter(data => !data.dateSuspensionRemoved))
        .map(type => Choice(type.typeInfo.actionLabel, type.typeInfo.uuid));
}

module.exports = options => {

    const { SUSPENSION } = options.caseActionData;
    const suspensionTypeChoices = buildSuspensionType(SUSPENSION);
    const suspensionUUID = suspensionTypeChoices[0].value;

    return Form()
        .withTitle('Case Suspension')
        .withPrimaryActionLabel('Suspend case')
        .withField(
            Component('inset', null)
                .withProp('children',
                    'By suspending the case you will be irreversibly removing the current ' +
                    'deadline for the case and any stage deadlines that apply to the case. If you ' +
                    'do not wish to suspend this case, please use the \'Back\' link below. Please ' +
                    'confirm you wish to suspend the case.')
                .build()
        )
        .withField(
            Component('hidden', 'caseTypeActionUuid')
                .withProp('choices', [ ...suspensionTypeChoices ])
                .build()
        )
        .withData({
            caseTypeActionUuid: `${ suspensionUUID }`
        })
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/?tab=CASE_ACTIONS`)
                .build()
        )
        .build();
};

