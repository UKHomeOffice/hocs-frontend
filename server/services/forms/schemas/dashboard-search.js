const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = (options = {}) => {
    const { submissionUrl } = options;
    return Form()
        .withField(
            Component('text', 'case-reference')
                .withProp('label', 'Load Case')
                .withProp('hint', 'For example ABC/1234567/12')
                .withValidator('isValidCaseReference', 'Case reference is invalid format')
                .withValidator('required', 'Case reference is required')
                .build()
        )
        .withNoPrimaryAction()
        .withSubmissionUrl(submissionUrl);
};