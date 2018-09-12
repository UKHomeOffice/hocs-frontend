const Form = require('./form-builder');
const { docsServiceClient } = require('../../libs/request');

function documentAdapter(document) {
    const tags = [];
    tags.push(document.type);
    return {
        label: document.name,
        value: document.document_uuid,
        tags: tags.length > 0 ? tags : null
    };
}

module.exports = async options => {
    const response = await docsServiceClient.get(`/case/${options.caseId}/document`);
    const choices = response.data.documents.map(documentAdapter);
    return Form()
        .withTitle('Manage documents')
        .withField({
            component: 'entity-manager',
            validation: [
                'required'
            ],
            props: {
                name: 'document_list',
                label: 'Documents',
                hasRemoveLink: true,
                hasAddLink: true,
                choices,
                baseUrl: `/case/${options.caseId}/stage/${options.stageId}/entity`,
                entity: 'document'
            }
        })
        .withPrimaryActionLabel('Finish')
        .withSecondaryAction({
            component: 'backlink',
            props: {
                label: 'Cancel'
            }
        })
        .withNoPrimaryAction()
        .build();
};