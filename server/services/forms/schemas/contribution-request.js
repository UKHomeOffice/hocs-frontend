const Form = require('../form-builder');
const { Component, ConditionChoice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');
const YEAR_RANGE = 120;
const MIN_ALLOWABLE_YEAR = (new Date().getFullYear() - YEAR_RANGE);
const MAX_ALLOWABLE_YEAR = (new Date().getFullYear() + YEAR_RANGE);

const ACTIONS = {
    ADD_ADDITIONAL_REQUEST: 'ADDADDITIONALREQUEST',
    ADD_REQUEST: 'ADDREQUEST',
    EDIT_REQUEST: 'EDITREQUEST',
    VIEW_REQUEST: 'VIEWREQUEST',
};

module.exports = async options => {
    const action = options.action;
    const isAdd = action ? action.toUpperCase() === ACTIONS.ADD_REQUEST || action.toUpperCase() === ACTIONS.ADD_ADDITIONAL_REQUEST : false;
    const isReadOnly = action ? action.toUpperCase() === ACTIONS.VIEW_REQUEST : true;
    const { data } = !isAdd ? await getSomuItem(options) : {};
    const primaryChoiceLabel = options.customConfig ? options.customConfig.primaryChoiceLabel : 'Business Area';
    const primaryChoiceList = options.customConfig ? options.customConfig.primaryChoiceList : 'MPAM_CONTRIBUTION_BUSINESS_AREAS';
    const showBusinessUnits = options.customConfig ? options.customConfig.showBusinessUnits : true;

    const form = Form()
        .withTitle(`${isAdd ? 'Add' : isReadOnly ? 'View' : 'Edit'} Contribution Request`)
        .withField(
            Component('dropdown', 'contributionBusinessArea')
                .withValidator('required')
                .withProp('label', primaryChoiceLabel)
                .withProp('disabled', isReadOnly)
                .withProp('choices', primaryChoiceList)
                .build()
        )
        .withOptionalField(
            Component('dropdown', 'contributionBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Business Unit')
                .withProp('disabled', isReadOnly)
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
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidDay', 'Contribution due date must contain a real day')
                .withValidator('isValidMonth', 'Contribution due date must contain a real month')
                .withValidator('isYearWithinRange', 'Contribution due date must be before ' + MAX_ALLOWABLE_YEAR)
                .withValidator('isValidWithinDate')
                .withProp('label', 'Contribution due date')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('text-area', 'contributionRequestNote')
                .withValidator('required')
                .withProp('label', 'What you are requesting')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        );

    if (isReadOnly) {
        form.withNoPrimaryAction();
    } else {
        form.withPrimaryActionLabel(isAdd ? 'Add' : 'Edit');
    }

    if (data) {
        form.withData(data);
    }

    return form.build();
};
