const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Add Correspondent')
    .withField(
        Component('radio', 'isMember')
            .withValidator('required', 'The correspondent type must be provided')
            .withProp('label', 'Is the correspondent a member of parliament?')
            .withProp('choices', [
                Choice('Yes', 'true'),
                Choice('No', 'false')
            ])
            .build()
    )
    .withPrimaryActionLabel('Continue')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
            .build()
    )
    .build();