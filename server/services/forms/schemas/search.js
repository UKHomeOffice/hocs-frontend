const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

module.exports = (options = {}) => {
    const { submissionUrl } = options;
    return Form()
        .withTitle('Search')
        .withField(
            Component('text', 'case-reference')
                .withProp('label', 'Case Reference')
                // TODO: Implement validator in validation middleware
                // .withValidator('isCaseReference', 'Case reference is invalid format')
                .build()
        )
        .withField(
            Component('date', 'date-received')
                .withProp('label', 'Date received')
                .withValidator('isBeforeToday', 'Date received cannot be in the past')
                .build()
        )
        .withField(
            Component('text', 'correspondent')
                .withProp('label', 'Correspondent')
                .build()
        )
        .withField(
            Component('text', 'topic')
                .withProp('label', 'Topic')
                .build()
        )
        .withField(
            Component('text', 'minister')
                .withProp('label', 'Sign-off Minister')
                .build()
        )
        .withField(
            Component('checkbox', 'active')
                .withProp('label', 'Active case?')
                .withProp('choices', [Choice('Yes', 'true')])
                .build()
        )
        .withPrimaryActionLabel('Search')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', '/')
                .build()
        )
        .withSubmissionUrl(submissionUrl)
        .build();
};