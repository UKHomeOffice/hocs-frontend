const { DOCUMENT_BULK_LIMIT } = require('../../../config').forContext('server');
const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = () => Form()
    .withTitle('Create Single Case')
    .withField(
        Component('date', 'DateReceived')
            .withValidator('required', 'Date received is required')
            .withProp('label', 'When was the correspondence received?')
            .build()
    )
    .withField(
        Component('date', 'DTENDispatchDeadline')
            .withValidator('required', 'Dispatch deadline is required')
            .withProp('label', 'What is the deadline for dispatch?')
            .build()
    )
    .withField(
        Component('date', 'DTENDraftDeadline')
            .withValidator('required', 'Draft deadline is required')
            .withProp('label', 'What is the deadline for drafting?')
            .build()
    )
    .withField(
        Component('add-document', 'add_document')
            .withValidator('hasWhitelistedExtension')
            .withValidator('fileLimit')
            .withProp('label', 'Are there any documents to include?')
            .withProp('hint', `There is a limit of ${DOCUMENT_BULK_LIMIT} documents`)
            .withProp('documentType', 'ORIGINAL')
            .withProp('allowMultiple', true)
            .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
            .build()
    )
    .withPrimaryActionLabel('Finish')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Cancel')
            .build()
    )
    .withData({
        'DateReceived': new Date().toISOString().substr(0, 10)
    })
    .build();