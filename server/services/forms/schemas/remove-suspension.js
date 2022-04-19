const Form = require('../form-builder');
const { Component } = require('../component-builder');



module.exports = options => {

    return Form()
        .withTitle('Remove Suspension')
        .withPrimaryActionLabel('Remove case suspension')
        .withField(
            Component('inset', null)
                .withProp('children',
                    'Please confirm you wish to remove the suspension on this case. If you ' +
                    'do not wish to remove this suspension, please use the \'Back\' link below. Otherwise ' +
                    'the suspension will be removed. Please note, since the case has been suspended, the deadline for' +
                    ' the case has been removed.')
                .withProp('hasSidebar', 'false')
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

