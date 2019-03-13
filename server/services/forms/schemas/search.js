const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');

module.exports = (options = {}) => {
    const { submissionUrl } = options;
    return Form()
        .withTitle('Search')
        .withField(
            Component('checkbox', 'caseTypes')
                .withProp('label', 'Case type')
                .withProp('choices', 'CASE_TYPES')
                .build()
        )
        .withField(
            Component('date', 'dateReceivedFrom')
                .withProp('label', 'Received after')
                .withValidator('isValidDate', 'Date received must be valid')
                .withValidator('isBeforeToday', 'Date received after cannot be in the future')
                .build()
        )
        .withField(
            Component('date', 'dateReceivedTo')
                .withProp('label', 'Received before')
                .withValidator('isValidDate', 'Date received must be valid')
                .withValidator('isBeforeToday', 'Date received before cannot be in the future')
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
            Component('dropdown', 'signOffMinister')
                .withProp('label', 'Sign-off Minister')
                .withProp('choices', 'MINISTERS')
                .build()
        )
        .withField(
            Component('checkbox', 'caseStatus')
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