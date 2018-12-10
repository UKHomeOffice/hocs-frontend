const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { caseworkServiceClient } = require('../../../libs/request');
const User = require('../../../models/user');

module.exports = async options => {
    const response = await caseworkServiceClient.get(`/case/${options.caseId}/topic/${options.context}`, { headers: User.createHeaders(options.user) });
    const displayName = response.data.label;
    return Form()
        .withTitle('Remove topic')
        .withField(
            Component('paragraph')
                .withProp('children', `Remove ${displayName} from case?`)
                .build()
        )
        .withPrimaryActionLabel('Remove')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        )
        .build();
};