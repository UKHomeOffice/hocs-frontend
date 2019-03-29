const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { caseworkService } = require('../../../clients');
const User = require('../../../models/user');

module.exports = async options => {
    const response = await caseworkService.get(`/case/${options.caseId}/topic/${options.context}`, { headers: User.createHeaders(options.user) });
    const displayName = response.data.label;
    return Form()
        .withTitle('Remove Topic')
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