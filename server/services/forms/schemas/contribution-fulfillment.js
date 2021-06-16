const Form = require('../form-builder');
const { Component, Choice, ConditionChoice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');
const YEAR_RANGE = 120;
const MIN_ALLOWABLE_YEAR = (new Date().getFullYear() - YEAR_RANGE);
const MAX_ALLOWABLE_YEAR = (new Date().getFullYear() + YEAR_RANGE);

module.exports = async options => {
    const { data } = await getSomuItem(options);
    const primaryChoiceLabel = options.customConfig ? options.customConfig.primaryChoiceLabel : 'Business Area';
    const primaryChoiceList = options.customConfig ? options.customConfig.primaryChoiceList : 'MPAM_CONTRIBUTION_BUSINESS_AREAS';
    const showBusinessUnits = options.customConfig ? options.customConfig.showBusinessUnits : true;

    return Form()
        .withTitle('Contribution Request Fulfillment')
        .withField(
            Component('dropdown', 'contributionBusinessArea')
                .withValidator('required')
                .withProp('label', primaryChoiceLabel)
                .withProp('choices', primaryChoiceList)
                .build()
        )
        .withOptionalField(
            Component('dropdown', 'contributionBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Business Unit')
                .withProp('conditionChoices', [
                    ConditionChoice('contributionBusinessArea', 'UKVI', 'S_MPAM_BUS_UNITS_1'),
                    ConditionChoice('contributionBusinessArea', 'BF', 'S_MPAM_BUS_UNITS_2'),
                    ConditionChoice('contributionBusinessArea', 'IE', 'S_MPAM_BUS_UNITS_3'),
                    ConditionChoice('contributionBusinessArea', 'EUSS', 'S_MPAM_BUS_UNITS_4'),
                    ConditionChoice('contributionBusinessArea', 'HMPO', 'S_MPAM_BUS_UNITS_5'),
                    ConditionChoice('contributionBusinessArea', 'Windrush', 'S_MPAM_BUS_UNITS_6'),
                    ConditionChoice('contributionBusinessArea', 'Coronavirus', 'S_MPAM_BUS_UNITS_7')
                ])
                .build(), showBusinessUnits
        )
        .withField(
            Component('date', 'contributionRequestDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidDay', 'Contribution request date must contain a real day')
                .withValidator('isValidMonth', 'Contribution request date  must contain a real month')
                .withValidator('isYearWithinRange', 'Contribution request date must be after ' + MIN_ALLOWABLE_YEAR)
                .withValidator('isBeforeToday')
                .withProp('label', 'Contribution request date')
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidDay', 'Contribution request date must contain a real day')
                .withValidator('isValidMonth', 'Contribution request date  must contain a real month')
                .withValidator('isYearWithinRange', 'Contribution due date must be before ' + MAX_ALLOWABLE_YEAR)
                .withValidator('isValidWithinDate')
                .withProp('label', 'Contribution due date')
                .build()
        )
        .withField(
            Component('text-area', 'contributionRequestNote')
                .withValidator('required')
                .withProp('label', 'What you are requesting')
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
                .withValidator('required')
                .withValidator('isValidDate',)
                .withValidator('isBeforeToday')
                .withValidator('isValidDay', 'Contribution request date must contain a real day')
                .withValidator('isValidMonth', 'Contribution request date  must contain a real month')
                .withValidator('isYearWithinRange', 'Contribution due date must be before ' + MAX_ALLOWABLE_YEAR)
                .withValidator('isValidWithinDate')
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
                .withValidator('required', 'Contribution completion notes is required')
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
                .withValidator('required', 'Contribution cancellation reason is required')
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
