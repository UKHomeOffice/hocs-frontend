const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Add Topic')
    .withField(
        Component('type-ahead', 'topic')
            .withValidator('required', 'Topic is required')
            .withProp('label', 'Topic')
            .withProp('choices', 'TOPICS_CASETYPE')
            .build()
    )
    .withPrimaryActionLabel('Add')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
            .build()
    )
    .build();