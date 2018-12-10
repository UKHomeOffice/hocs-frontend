const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { docsServiceClient } = require('../../../libs/request');
const User = require('../../../models/user');

module.exports = async options => {
    const response = await docsServiceClient.get(`/document/${options.context}`,  { headers: User.createHeaders(options.user) });
    const displayName = response.data.displayName;
    return Form()
        .withTitle('Remove document')
        .withField(
            Component('paragraph')
                .withProp('children', `Remove ${displayName} from case?`)
                .build()
        )
        .withPrimaryActionLabel('Remove')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}/entity/document/manage`)
                .build()
        )
        .build();
};