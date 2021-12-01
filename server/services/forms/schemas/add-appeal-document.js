const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async (options) => {
    return Form()
        .withTitle('Add Appeal Document')
        .withField(
            Component('hidden', 'document_type')
                .withProp('label', 'doc type')
                .build()
        ).withField(
            Component('add-document', 'add_document')
                .withValidator('hasWhitelistedExtension')
                .withValidator('required', 'Document is required')
                .withValidator('fileLimit')
                .withProp('label', 'Would you like to include any more documents?')
                .withProp('allowMultiple', true)
                .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
                .build()
        )
        .withData({
            document_type: 'Appeal Response'
        })
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action',
                    `/case/${options.caseId}/stage/${options.stageId}/caseAction/appeal/update/${options.caseActionId}?hideSidebar=false`)
                .build()
        )
        .withPrimaryActionLabel('Add')
        .build();
};