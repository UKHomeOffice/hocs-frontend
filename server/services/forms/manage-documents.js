const Form = require('./form-builder');
const { getList } = require('../../services/list');

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
    const response = await getList('CASE_DOCUMENT_LIST', { caseId: options.caseId });
    const choices = response.map(documentAdapter);
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