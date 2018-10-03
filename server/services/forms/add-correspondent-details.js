const Form = require('./form-builder');
const { Component, Choice } = require('./component-builder');

module.exports = options => Form()
    .withTitle('Record correspondent details')
    .withField(
        Component('dropdown', 'type')
            .withValidator('required', 'The correspondent must have a type')
            .withProp('label', 'Correspondent type')
            .withProp('choices', 'CORRESPONDENT_TYPES')
            .build()
    )
    .withField(
        Component('text', 'fullname')
            .withValidator('required', 'The correspondent\'s full name is required')
            .withProp('label', 'Full Name')
            .build()
    )
    .withField(
        Component('text', 'address1')
            .withProp('label', 'Building')
            .build()
    )
    .withField(
        Component('text', 'address2')
            .withProp('label', 'Street')
            .build()
    )
    .withField(
        Component('text', 'address3')
            .withProp('label', 'Town or City')
            .build()
    )
    .withField(
        Component('text', 'postcode')
            .withProp('label', 'Postcode')
            .build()
    )
    .withField(
        Component('dropdown', 'country')
            .withProp('label', 'Country')
            .withProp('choices', [
                Choice('United Kingdom', 'United Kingdom'),
                Choice('Other', 'Other')
            ])
            .build()
    )
    .withField(
        Component('text', 'telephone')
            .withProp('label', 'Telephone')
            .build()
    )
    .withField(
        Component('text', 'email')
            .withProp('label', 'Email address')
            .build()
    )
    .withField(
        Component('text', 'reference')
            .withProp('label', 'Does this correspondent give a case reference?')
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