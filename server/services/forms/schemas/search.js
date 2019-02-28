const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

module.exports = (options = {}) => {
    const { submissionUrl } = options;
    return Form()
        .withTitle('Search')
        .withField(
            Component('text', 'case-reference')
                .withProp('label', 'Case Reference')
                .withProp('hint', 'For example ABC/123456/12')
                .withValidator('isValidCaseReference', 'Case reference is invalid format')
                .build()
        )
        .withField(
            Component('date', 'date-received-from')
                .withProp('label', 'Received after')
                .withValidator('isValidDate', 'Date received must be valid')
                .withValidator('isBeforeToday', 'Date received cannot be in the past')
                .build()
        )
        .withField(
            Component('date', 'date-received-to')
                .withProp('label', 'Received before')
                .withValidator('isValidDate', 'Date received must be valid')
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
            Component('checkbox', 'case-status')
                .withProp('label', 'Case status')
                .withProp('choices', [Choice('Active', 'active')])
                .build()
        )
        .withPrimaryActionLabel('Search')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', '/')
                .build()
        )
        .withSubmissionUrl(submissionUrl);
};