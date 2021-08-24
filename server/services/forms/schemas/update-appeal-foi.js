const Form = require('../form-builder');
const { getSomuItem } = require('../../../middleware/somu');
const { Component, Choice } = require('../component-builder');


module.exports = async options => {
    const { data } = await getSomuItem(options);

    return Form()
        .withTitle('Appeals')
        .withPrimaryActionLabel('Edit Appeal')
        .withField(
            Component('heading', 'log-an-appeal-heading')
                .withProp('label', 'Log an appeal')
                .build()
        ).withField(
            Component('mapped-display', 'appealType')
                .withValidator('required')
                .withProp('label', 'Which type of appeal needs to be applied?')
                .withProp('choices', 'FOI_APPEAL_TYPES')
                .build()
        ).withField(
            Component('dropdown', 'IROfficerDirectorate')
                .withValidator('required')
                .withProp('label', 'Internal review officer directorate')
                .withProp('choices', 'S_FOI_DIRECTORATES')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'appealType',
                        'conditionPropertyValue': 'INTERNAL_REVIEW'
                    }
                ])
                .withValidator('required', 'Internal review officer name is required')
                .build()
        ).withField(
            Component('dropdown', 'IROfficerName')
                .withValidator('required')
                .withProp('label', 'Internal review officer name')
                .withProp('choices', 'S_FOI_KIMU_TEAM_MEMBERS')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'appealType',
                        'conditionPropertyValue': 'INTERNAL_REVIEW'
                    }
                ])
                .withValidator('required', 'Internal review officer name is required')
                .build()
        )
        .withField(
            Component('radio', 'appealStatus')
                .withProp('label', 'Has this been completed?')
                .withProp('choices', [
                    Choice('No', 'appealPending'),
                    Choice('Yes', 'appealComplete')
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
                        'conditionPropertyName': 'appealStatus',
                        'conditionPropertyValue': 'appealComplete'
                    }
                ])
                .build()
        ).withField(
            Component('radio', 'appealOutcome')
                .withValidator('required')
                .withProp('label', 'What was the outcome?')
                .withProp('choices', [
                    Choice('Decision Upheld', 'DecisionUpheld'),
                    Choice('Decision Part Upheld', 'DecisionPartUpheld'),
                    Choice('Complaint Upheld', 'ComplaintUpheld')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'appealStatus',
                        'conditionPropertyValue': 'appealComplete'
                    }
                ])
                .build()
        ).withField(
            Component('radio', 'complex')
                .withValidator('required')
                .withProp('label', 'Was the case complex?')
                .withProp('choices', [
                    Choice('Yes', 'complex-y'),
                    Choice('No', 'complex-n')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'appealStatus',
                        'conditionPropertyValue': 'appealComplete'
                    }
                ])
                .build()
        ).withField(
            Component('text-area', 'notes')
                .withValidator('required', 'Appeal completion notes are required')
                .withProp('label', 'Details')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'appealStatus',
                        'conditionPropertyValue': 'appealComplete'
                    }
                ])
                .build()
        )
        .withSecondaryAction(
            Component('button')
                .withProp('label', 'Cancel')
                .withProp('className', 'govuk-!-margin-left-1 govuk-button--secondary')
                .withProp('preventDefault', 'false')
                .withProp('action',
                    `/case/${options.caseId}/stage/${options.stageId}/somu/${options.somuTypeUuid}/${options.somuType}/${options.somuCaseType}/MANAGE_APPEALS?hideSidebar=false`)
                .build()
        )
        .withPrimaryActionLabel('Update')
        .withData(data)
        .build();
};
