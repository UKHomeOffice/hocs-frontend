const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Attach case note')
    .withField(
        Component('text-area', 'case-note')
            .withValidator('required', 'Case note is required')
            .withProp('label', 'Note')
            .build()
    )
    .withPrimaryActionLabel('Attach')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
            .build()
    )
    .build();