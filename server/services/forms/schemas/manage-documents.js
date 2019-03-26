const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async (options) => {
    return Form()
        .withTitle('Manage Documents')
        .withField(
            Component('entity-manager', 'document_list')
                .withProp('label', 'Documents')
                .withProp('hasRemoveLink', true)
                .withProp('hasAddLink', true)
                .withProp('choices', 'CASE_DOCUMENT_LIST')
                .withProp('baseUrl', `/case/${options.caseId}/stage/${options.stageId}/entity`)
                .withProp('entity', 'document')
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        )
        .withNoPrimaryAction()
        .build();
};