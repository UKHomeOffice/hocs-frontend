const Form = require('./form-builder');
const { docsServiceClient } = require('../../libs/request');

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
    // TODO: Move in to list service
    const response = await docsServiceClient.get(`/document/case/${options.caseId}`);
    const choices = response.data.documents.map(documentAdapter).sort((first, second) => {
        const firstTimeStamp = first.timeStamp.toUpperCase();
        const secondTimeStamp = second.timeStamp.toUpperCase();
        return (firstTimeStamp < secondTimeStamp) ? 1 : -1;
    });
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
        .withSecondaryAction({
            component: 'backlink',
            props: {
                label: 'Back',
                action: `/case/${options.caseId}/stage/${options.stageId}`
            }
        })
        .withNoPrimaryAction()
        .build();
};