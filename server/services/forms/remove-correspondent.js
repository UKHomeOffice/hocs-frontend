const Form = require('./form-builder');
const { workflowServiceClient } = require('../../libs/request');

module.exports = async options => {
    const response = await workflowServiceClient.get(`/case/${options.caseId}/correspondent/${options.context}`);
    const displayName = response.data.fullname;
    return Form()
        .withTitle('Remove correspondent')
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
                action: `/case/${options.caseId}/stage/${options.stageId}`
            }
        })
        .build();
};