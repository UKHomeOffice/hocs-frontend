const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');


function buildAppealTypeChoices(appealTypeArray) {
    return appealTypeArray.map(type => Choice(type.typeInfo.actionLabel, type.typeInfo.uuid));
}


module.exports = async options => {

    const { caseId, stageId, caseActionId } = options;
    const { APPEAL } = options.caseActionData;
    let appealData = APPEAL.filter(appealType => appealType.typeData.length > 0)
        .flatMap(appealType => appealType.typeData)
        .filter(appealData => appealData.uuid === caseActionId)[0];

    const appealType = APPEAL.filter(appealType => appealType.typeInfo.uuid === appealData.caseTypeActionUuid)[0];
    const { appealOfficerData: appealOfficerInfo } = JSON.parse(appealType.typeInfo.props);
    const appealTypeChoices = buildAppealTypeChoices(APPEAL);

    if (appealOfficerInfo) {
        const appealOfficerData = JSON.parse(appealData.appealOfficerData);
        appealData = { ...appealData, ...appealOfficerData };
        return Form()
            .withTitle('Appeals')
            .withPrimaryActionLabel('Update Appeal')
            .withField(
                Component('heading', 'log-an-appeal-heading')
                    .withProp('label', 'Update an appeal')
                    .build()
            ).withField(
                Component('mapped-display', 'caseTypeActionUuid')
                    .withValidator('required')
                    .withProp('label', 'Which type of appeal needs to be applied?')
                    .withProp('choices', [ ...appealTypeChoices ])
                    .build()
            )
            .withField(
                Component('mapped-display', appealOfficerInfo.directorate.value)
                    .withValidator('required')
                    .withProp('label', appealOfficerInfo.directorate.label)
                    .withProp('choices', appealOfficerInfo.directorate.choices)
                    .withValidator('required', `${appealOfficerInfo.directorate.label} is required`)
                    .build()
            ).withField(
                Component('mapped-display', appealOfficerInfo.officer.value)
                    .withValidator('required')
                    .withProp('label', appealOfficerInfo.officer.label)
                    .withProp('choices', appealOfficerInfo.officer.choices)
                    .withValidator('required', `${appealOfficerInfo.officer.label} is required`)
                    .build()
            )
            .withField(
                Component('radio', 'status')
                    .withProp('label', 'Has this been completed?')
                    .withProp('choices', [
                        Choice('No', 'Pending'),
                        Choice('Yes', 'Complete')
                    ])
                    .build()
            ).withField(
                Component('date', 'dateSentRMS')
                    .withValidator('required')
                    .withValidator('isValidDate')
                    .withValidator('isBeforeToday')
                    .withProp('label', 'When was this completed?')
                    .withProp('visibilityConditions', [
                        {
                            'conditionPropertyName': 'status',
                            'conditionPropertyValue': 'Complete'
                        }
                    ])
                    .build()
            ).withField(
                Component('radio', 'outcome')
                    .withValidator('required')
                    .withProp('label', 'What was the outcome?')
                    .withProp('choices', [
                        Choice('Decision Upheld', 'DecisionUpheld'),
                        Choice('Decision Part Upheld', 'DecisionPartUpheld'),
                        Choice('Complaint Upheld', 'ComplaintUpheld')
                    ])
                    .withProp('visibilityConditions', [
                        {
                            'conditionPropertyName': 'status',
                            'conditionPropertyValue': 'Complete'
                        }
                    ])
                    .build()
            ).withField(
                Component('radio', 'complexCase')
                    .withValidator('required')
                    .withProp('label', 'Was the case complex?')
                    .withProp('choices', [
                        Choice('Yes', 'Yes'),
                        Choice('No', 'No')
                    ])
                    .withProp('visibilityConditions', [
                        {
                            'conditionPropertyName': 'status',
                            'conditionPropertyValue': 'Complete'
                        }
                    ])
                    .build()
            ).withField(
                Component('text-area', 'note')
                    .withValidator('required', 'Appeal completion notes are required')
                    .withProp('label', 'Details')
                    .withProp('visibilityConditions', [
                        {
                            'conditionPropertyName': 'status',
                            'conditionPropertyValue': 'Complete'
                        }
                    ])
                    .build()
            )
            .withSecondaryAction(
                Component('backlink')
                    .withProp('label', 'Back')
                    .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                    .build()
            )
            .withPrimaryActionLabel('Update')
            .withData(appealData)
            .build();
    }


    return Form()
        .withTitle('Appeals')
        .withPrimaryActionLabel('Update Appeal')
        .withField(
            Component('heading', 'log-an-appeal-heading')
                .withProp('label', 'Update an appeal')
                .build()
        ).withField(
            Component('mapped-display', 'caseTypeActionUuid')
                .withValidator('required')
                .withProp('label', 'Which type of appeal needs to be applied?')
                .withProp('choices', [ ...appealTypeChoices ])
                .build()
        )
        .withField(
            Component('radio', 'status')
                .withProp('label', 'Has this been completed?')
                .withProp('choices', [
                    Choice('No', 'Pending'),
                    Choice('Yes', 'Complete')
                ])
                .build()
        ).withField(
            Component('date', 'dateSentRMS')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isBeforeToday')
                .withProp('label', 'When was this completed?')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'status',
                        'conditionPropertyValue': 'Complete'
                    }
                ])
                .build()
        ).withField(
            Component('radio', 'outcome')
                .withValidator('required')
                .withProp('label', 'What was the outcome?')
                .withProp('choices', [
                    Choice('Decision Upheld', 'DecisionUpheld'),
                    Choice('Decision Part Upheld', 'DecisionPartUpheld'),
                    Choice('Complaint Upheld', 'ComplaintUpheld')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'status',
                        'conditionPropertyValue': 'Complete'
                    }
                ])
                .build()
        ).withField(
            Component('radio', 'complexCase')
                .withValidator('required')
                .withProp('label', 'Was the case complex?')
                .withProp('choices', [
                    Choice('Yes', 'Yes'),
                    Choice('No', 'No')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'status',
                        'conditionPropertyValue': 'Complete'
                    }
                ])
                .build()
        ).withField(
            Component('text-area', 'note')
                .withValidator('required', 'Appeal completion notes are required')
                .withProp('label', 'Details')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'status',
                        'conditionPropertyValue': 'Complete'
                    }
                ])
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${caseId}/stage/${stageId}`)
                .build()
        )
        .withPrimaryActionLabel('Update')
        .withData(appealData)
        .build();
};
