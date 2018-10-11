const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Add member of parliament')
    .withField(
        Component('type-ahead', 'member')
            .withValidator('required', 'Member is required')
            .withProp('label', 'Member')
            .withProp('choices', 'MEMBER_LIST')
            .build()
    )
    .withPrimaryActionLabel('Add')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/entity/correspondent/add`)
            .build()
    )
    .build();