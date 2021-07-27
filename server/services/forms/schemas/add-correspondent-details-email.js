const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

function buildUrl(options) {
    const url = `/case/${options.caseId}/stage/${options.stageId}`;
    if (options.action === 'addNoMp') {
        return url;
    }
    return url + '/entity/correspondent/add';
}

module.exports = options => Form()
    .withTitle('Record Correspondent Details')
    .withField(
        Component('text', 'fullname')
            .withValidator('required', 'The correspondent\'s full name is required')
            .withProp('label', 'Full Name')
            .build()
    )
    .withField(
        Component('dropdown', 'country')
            .withProp('label', 'Country')
            .withProp('choices', [
                Choice('United Kingdom', 'United Kingdom'),
                Choice('Other', 'Other')
            ])
            .build()
    )
    .withField(
        Component('text', 'email')
            .withProp('label', 'Email Address')
            .build()
    )
    .withField(
        Component('text-area', 'reference')
            .withProp('label', 'Requester\'s Reference')
            .build()
    )
    .withPrimaryActionLabel('Add')
    .withSecondaryAction(
        Component('backlink')
            .withProp('label', 'Back')
            .withProp('action', buildUrl(options))
            .build()
    )
    .build();
