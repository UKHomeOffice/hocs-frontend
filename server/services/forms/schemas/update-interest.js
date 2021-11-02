const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async options => {

    const { caseId, stageId, caseActionId } = options;

    const { EXTERNAL_INTEREST } = options.caseActionData;
    let externalInterestData = EXTERNAL_INTEREST.filter(appealType => appealType.typeData.length > 0)
        .flatMap(appealType => appealType.typeData)
        .filter(appealData => appealData.uuid === caseActionId)[0];

    return Form()
        .withTitle('Add Interest')
        .withPrimaryActionLabel('Add Interest')
        .withField(
            Component('dropdown', 'interestedPartyType')
                .withValidator('required')
                .withProp('label', 'Interested party')
                .withProp('choices', 'FOI_INTERESTED_PARTIES')
                .build()
        )
        .withField(
            Component('text-area', 'detailsOfInterest')
                .withProp('label', 'Details of Interest')
                .build()
        )
        .withSecondaryAction(
            Component('button')
                .withProp('label', 'Cancel')
                .withProp('className', 'govuk-!-margin-left-1 govuk-button--secondary')
                .withProp('preventDefault', 'false')
                .withProp('action',
                    `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withPrimaryActionLabel('Update')
        .withData(externalInterestData)
        .build();
};
