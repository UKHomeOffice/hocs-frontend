const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = options => Form()
    .withTitle('Create template')
    .withField(
        Component('dropdown', 'caseType')
            .withValidator('required', 'Associated Case Type is required')
            .withProp('label', 'Associated Case Type')
            .withProp('choices', 'CASE_TYPES')
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