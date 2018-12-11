const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { getList } = require('../../../services/list');

function documentAdapter(document) {
    const tags = [];
    tags.push(document.type);
    tags.push(document.status);
    return {
        label: document.displayName,
        value: document.uuid,
        timeStamp: document.created,
        tags: tags.length > 0 ? tags : null
    };
}

module.exports = async options => {
    const response = await getList('CASE_DOCUMENT_LIST', { caseId: options.caseId, user: options.user });
    const choices = response.map(documentAdapter);
    return Form()
        .withTitle('Manage documents')
        .withField(
            Component('entity-manager', 'document_list')
                .withProp('label', 'Documents')
                .withProp('hasRemoveLink', true)
                .withProp('hasAddLink', true)
                .withProp('choices', choices)
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