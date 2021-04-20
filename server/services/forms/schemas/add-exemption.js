const Form = require('../form-builder');
const { Choice, Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Add Exemption')
    .withField( //
        Component('dropdown', 'exemption_type')
            .withValidator('required', 'Exemption type is required')
            .withProp('label', 'Exemption type')
            //         .withProp('choices', 'EXEMPTION_TYPES')
            .withProp('choices', [
                Choice('Accessible by Other Means', '21_AVAILABLE_BY_OTHER_MEANS'),
                Choice('Other', 'Other')
            ])
            .build()
    )
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
            .build()
    )
    .build();