const Form = require('./form-builder');
const { Component } = require('./component-builder');
const { docsServiceClient } = require('../../libs/request');

module.exports = async options => {
    const response = await docsServiceClient.get(`/document/${options.context}`);
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