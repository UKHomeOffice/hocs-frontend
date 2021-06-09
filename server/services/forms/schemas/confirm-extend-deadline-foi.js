const Form = require('../form-builder');
const { Choice, Component } = require('../component-builder');

module.exports = (options) => {
    return Form()
        .withTitle('Apply an extension to this case')
        .withField(
            Component('radio', 'shouldApplyExtension')
                .withValidator('required', 'You must select yes or no')
                .withProp('choices', [
                    Choice('Yes', 'true', { description: 'The case due date will be extended by 20 working days',
                        conditionalContent: { label: 'Reason', description: 'Please enter the reason for this extension' } }),
                    Choice('No', 'false', { description: 'Leave case at current due date' })
                ])
                .build()
        ).withField(
            Component('hidden', 'extensionType')
                .withProp('label', 'FOI_PIT')
                .build()
        ).withData({
            extensionType: 'FOI_PIT'
        })
        .withPrimaryActionLabel('Continue')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        )
        .build();
};
