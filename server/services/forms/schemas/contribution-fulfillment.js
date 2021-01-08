const Form = require('../form-builder');
const { Component, Choice, ConditionChoice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');

module.exports = async options => {
    const { data } = await getSomuItem(options);

    return Form()
        .withTitle('Contribution Request Fulfillment')
        .withField(
            Component('dropdown', 'contributionBusinessArea')
                .withValidator('required', 'Business area is required')
                .withProp('label', 'Business Area')
                .withProp('disabled', true)
                .withProp('choices', [
                    Choice('UKVI', 'UKVI'),
                    Choice('BF', 'BF'),
                    Choice('IE', 'IE'),
                    Choice('EUSS', 'EUSS'),
                    Choice('HMPO', 'HMPO'),
                    Choice('Windrush', 'Windrush'),
                    Choice('Coronavirus (COVID-19)', 'Coronavirus')
                ])
                .build()
        )
        .withField(
            Component('dropdown', 'contributionBusinessUnit')
                .withValidator('required', 'Business unit is required')
                .withProp('label', 'Business Unit')
                .withProp('disabled', true)
                .withProp('conditionChoices', [
                    ConditionChoice('contributionBusinessArea', 'UKVI', 'S_MPAM_BUS_UNITS_1'),
                    ConditionChoice('contributionBusinessArea', 'BF', 'S_MPAM_BUS_UNITS_2'),
                    ConditionChoice('contributionBusinessArea', 'IE', 'S_MPAM_BUS_UNITS_3'),
                    ConditionChoice('contributionBusinessArea', 'EUSS', 'S_MPAM_BUS_UNITS_4'),
                    ConditionChoice('contributionBusinessArea', 'HMPO', 'S_MPAM_BUS_UNITS_5'),
                    ConditionChoice('contributionBusinessArea', 'Windrush', 'S_MPAM_BUS_UNITS_6'),
                    ConditionChoice('contributionBusinessArea', 'Coronavirus', 'S_MPAM_BUS_UNITS_7')
                ])
                .build()
        )
        .withField(
            Component('date', 'contributionRequestDate')
                .withValidator('required', 'Contribution request date is required')
                .withValidator('isValidDate', 'Contribution request date must be a valid date')
                .withValidator('isBeforeToday', 'Contribution request date must be in the past')
                .withProp('label', 'Contribution request date')
                .withProp('disabled', true)
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required', 'Contribution due date is required')
                .withValidator('isValidDate', 'Contribution due date must be a valid date')
                .withValidator('isAfterToday', 'Contribution due date must in the future')
                .withProp('label', 'Contribution due date')
                .build()
        )
        .withField(
            Component('text-area', 'contributionRequestNote')
                .withProp('label', 'What you are requesting')
                .withProp('disabled', true)
                .build()
        )
        .withField(
            Component('radio', 'contributionStatus')
                .withProp('label', 'Contribution Status')
                .withProp('choices', [
                    Choice('Complete', 'contributionReceived'),
                    Choice('Cancelled', 'contributionCancelled')
                ])
                .build()
        )
        .withField(
            Component('date', 'contributionReceivedDate')
                .withValidator('required', 'Contribution received date is required')
                .withValidator('isValidDate', 'Contribution received date must be a valid date')
                .withValidator('isBeforeToday', 'Contribution received date must be in the past')
                .withProp('label', 'Contribution received date')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'contributionStatus',
                        'conditionPropertyValue': 'contributionReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('text-area', 'contributionReceivedNote')
                .withValidator('required', 'Contribution completion notes reason required')
                .withProp('label', 'Details')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'contributionStatus',
                        'conditionPropertyValue': 'contributionReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('text-area', 'contributionCancellationNote')
                .withValidator('required', 'Contribution cancellation reason required')
                .withProp('label', 'Reason for cancelling')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'contributionStatus',
                        'conditionPropertyValue': 'contributionCancelled'
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
        .withData(data)
        .build();
};
