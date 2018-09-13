const Form = require('./form-builder');
const { docsServiceClient } = require('../../libs/request');

module.exports = async options => {
    const response = await docsServiceClient.get(`/case/${options.caseId}/document/${options.context}`);
    const displayName = response.data.name;
    return Form(options)
        .withTitle('Remove Document')
        .withField({
            component: 'paragraph',
            props: {
                children: `Remove ${displayName} from case?`
            }
        })
        .withPrimaryActionLabel('Remove')
        .build();
};