const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');
const { caseworkService } = require('../../../clients');
const User = require('../../../models/user');

module.exports = async ({ caseId, stageId, context, user, requestId }) => {
    const { data: { address, ...data } } = await caseworkService.get(`/case/${caseId}/correspondent/${context}`, { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });
    return Form()
        .withTitle('Edit Correspondent Details')
        .withField(
            Component('text', 'fullname')
                .withValidator('required', 'The correspondent\'s full name is required')
                .withProp('label', 'Full Name')
                .build()
        )
        .withField(
            Component('text', 'address1')
                .withProp('label', 'Building')
                .build()
        )
        .withField(
            Component('text', 'address2')
                .withProp('label', 'Street')
                .build()
        )
        .withField(
            Component('text', 'address3')
                .withProp('label', 'Town or City')
                .build()
        )
        .withField(
            Component('text', 'postcode')
                .withProp('label', 'Postcode')
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
            Component('text', 'telephone')
                .withProp('label', 'Telephone')
                .build()
        )
        .withField(
            Component('text', 'email')
                .withProp('label', 'Email Address')
                .build()
        )
        .withField(
            Component('text', 'reference')
                .withProp('label', 'Does this correspondent give a reference?')
                .build()
        )
        .withField(
            Component('hidden', 'externalKey')
                .withProp('label', 'External member reference')
                .build()
        )
        .withPrimaryActionLabel('Save')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withData({ ...address, ...data })
        .build();
};