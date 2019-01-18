const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = () => Form()
    .withTitle('Create Single Case')
    .withField(
        Component('radio', 'case-type')
            .withValidator('required', 'Case type is required')
            .withProp('label', 'What type of correspondence do you have?')
            .withProp('choices', 'CASE_TYPES')
            .build()
    )
    .withPrimaryActionLabel('Next')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Cancel')
            .build()
    )
    .build();