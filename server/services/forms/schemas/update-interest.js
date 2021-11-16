const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async options => {

    const { caseId, stageId, caseActionId } = options;

    const { EXTERNAL_INTEREST } = options.caseActionData;
    let externalInterestData = EXTERNAL_INTEREST.filter(interestType => interestType.typeData.length > 0)
        .flatMap(interestType => interestType.typeData)
        .find(interestData => interestData.uuid === caseActionId);

    let externalInterestProps = EXTERNAL_INTEREST.filter(interestType => interestType.typeData.length > 0)
        .flatMap(interestType => interestType.typeInfo)
        .find(interestType => interestType.uuid === externalInterestData.caseTypeActionUuid).props;

    let externalInterestChoices = JSON.parse(externalInterestProps).interestChoices;

    return Form()
        .withTitle('Add Interest')
        .withPrimaryActionLabel('Add Interest')
        .withField(
            Component('mapped-display', 'interestedPartyType')
                .withProp('label', 'Interested party')
                .withProp('choices', externalInterestChoices)
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
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action',
                    `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withPrimaryActionLabel('Update')
        .withData({ ...externalInterestData, caseTypeActionUuid: externalInterestData.caseTypeActionUuid })
        .build();
};
