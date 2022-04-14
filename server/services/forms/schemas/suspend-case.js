const Form = require('../form-builder');

const { Component } = require('../component-builder');

module.exports = options => {

    return Form()
        .withTitle('Case Suspension')
        .withPrimaryActionLabel('Suspend case')
        .withField(
            Component('inset', null)
                .withProp('label',
                    'By suspending the case you will be irreversibly removing the current ' +
                    'deadline for the case and any stage deadlines that apply to the case. If you ' +
                    'do not wish to suspend this case, please use the \'Back\' link below. Please ' +
                    'confirm you wish to suspend the case.')
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/?tab=CASE_ACTIONS`)
                .build()
        )
        .build();
};

