const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { workflowServiceClient } = require('../../../libs/request');

module.exports = async options => {
    const response = await workflowServiceClient.get(`/case/${options.caseId}/correspondent/${options.context}`);
    const displayName = response.data.fullname;
    return Form()
        .withTitle('Remove correspondent')
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