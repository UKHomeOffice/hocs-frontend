const Form = require('./form-builder');
const { Component, Choice } = require('./component-builder');

module.exports = options => Form()
    .withTitle('Add documents to case')
    .withField(
        Component('dropdown', 'document_type')
            .withValidator('required', 'Document type is required')
            .withProp('label', 'Document type')
            .withProp('choices', [
                Choice('Original', 'ORIGINAL'),
                Choice('Draft', 'DRAFT')
            ])
            .build()
    )
    .withField(
        Component('add-document', 'add_document')
            .withValidator('required', 'Document is required')
            .withValidator('hasWhitelistedExtension')
            .withValidator('fileLimit')
            .withProp('documentType', 'ORIGINAL')
            .withProp('label', 'Documents')
            .withProp('allowMultiple', true)
            .withlist('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
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