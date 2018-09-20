const Form = require('./form-builder');
const { docsServiceClient } = require('../../libs/request');

module.exports = async options => {
    // TODO: Move in to list service
    const response = await docsServiceClient.get(`/case/${options.caseId}/document/${options.context}`);
    const displayName = response.data.name;
    return Form(options)
        .withTitle('Remove document')
        .withField({
            component: 'paragraph',
            props: {
                children: `Remove ${displayName} from case?`
            }
        })
        .withPrimaryActionLabel('Remove')
        .withSecondaryAction({
            component: 'backlink',
            props: {
                label: 'Back',
                action: `/case/${options.caseId}/stage/${options.stageId}/entity/document/manage`
            }
        })
        .build();
};