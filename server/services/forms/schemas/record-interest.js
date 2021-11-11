const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = CASE_TYPE => async options => {

    const { caseId, stageId } = options;

    const { EXTERNAL_INTEREST } = options.caseActionData;
    const type = EXTERNAL_INTEREST.find(type => type.typeInfo.caseType === CASE_TYPE);

    return Form()
        .withTitle('Add Interest')
        .withPrimaryActionLabel('Add Interest')
        .withField(
            Component('dropdown', 'interestedPartyType')
                .withValidator('required')
                .withProp('label', 'Interested party')
                .withProp('choices', type.typeInfo.props.interestChoices)
                .build()
        )
        .withField(
            Component('text-area', 'detailsOfInterest')
                .withProp('label', 'Details of Interest')
                .build()
        )
        .withField(
            Component('hidden', 'caseTypeActionUuid')
                .build()
        )
        .withData({
            caseTypeActionUuid: type.id
        })
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action',
                    `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withPrimaryActionLabel('Add')
        .build();
};
