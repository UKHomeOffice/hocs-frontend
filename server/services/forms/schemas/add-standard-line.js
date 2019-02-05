const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Create standard line')
    .withField(
        Component('type-ahead', 'topic')
            .withValidator('required', 'Associated topic is required')
            .withProp('label', 'Associated topic')
            .withProp('choices', 'TOPICS_USER')
            .build()
    )
    .withField(
        Component('date', 'expiry_date')
            .withValidator('required', 'Expiration date is required')
            .withValidator('isValidDate', 'Expiration date must be a valid date')
            .withValidator('isAfterToday', 'Expiration date must not be in the past')
            .withProp('label', 'Expiration date')
            .build()
    )
    .withField(
        Component('add-document', 'document')
            .withValidator('required', 'Document is required')
            .withValidator('hasWhitelistedExtension')
            .withValidator('fileLimit')
            .withProp('documentType', 'ORIGINAL')
            .withProp('label', 'Documents')
            .withProp('allowMultiple', false)
            .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
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