const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = (options = {}) => {
    const { submissionUrl } = options;
    return Form()
        .withTitle('Search')
        .withField(
            Component('text', 'case-reference')
                .withProp('label', 'Case Reference')
                .withProp('hint', 'For example ABC/123456/12')
                .withValidator('isValidCaseReference', 'Case reference is invalid format')
                .withValidator('required', 'Case reference is required')
                .build()
        )
        .withPrimaryActionLabel('Find')
        .withSubmissionUrl(submissionUrl);
};