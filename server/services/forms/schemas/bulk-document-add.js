const { DOCUMENT_BULK_LIMIT } = require('../../../config').forContext('server');
const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = () => Form()
    .withTitle('Create Bulk Cases')
    .withField(
        Component('date', 'DateReceived')
            .withValidator('required', 'Date received is required')
            .withValidator('isValidDate', 'Date received must be a valid date')
            .withValidator('isBeforeToday', 'Date received cannot be in the future')
            .withProp('label', 'When was the correspondence received?')
            .build()
    )
    .withField(
        Component('add-document', 'add_document')
            .withValidator('required', 'Documents are mandatory when bulk creating a case')
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