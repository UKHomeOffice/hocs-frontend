const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async (options) => {
    return Form()
        .withTitle('Manage Documents')
        .withField(
            Component('entity-manager', 'document_list')
                .withProp('label', 'Documents')
                .withProp('hasRemoveLink', true)
                .withProp('hasAddLink', false)
                .withProp('choices', 'CASE_ACTION_DOCUMENT_LIST')
                .withProp('baseUrl', `/case/${options.caseId}/stage/${options.stageId}/entity`)
                .withProp('entity', 'document')
                .withProp('isGrouped', true)
                .build()
        )
        .withField(
            Component('hidden', 'document_type')
                .withProp('label', 'doc type')
                .build()
        ).withField(
            Component('add-document', 'add_document')
                .withValidator('hasWhitelistedExtension')
                .withValidator('fileLimit')
                .withProp('label', 'Would you like to include any more documents?')
                .withProp('allowMultiple', true)
                .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
                .build()
        )
        .withData({
            document_type: 'Appeal Information'
        })
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/?tab=FOI_ACTIONS`)
                .build()
        )
        .withPrimaryActionLabel('Add')
        .build();
};