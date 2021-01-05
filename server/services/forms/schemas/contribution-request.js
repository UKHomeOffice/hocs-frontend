const Form = require('../form-builder');
const { Component, Choice, ConditionChoice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');

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

    const form = Form()
        .withTitle(`${isAdd ? 'Add' : isReadOnly ? 'View' : 'Edit'} Contribution Request`)
        .withField(
            Component('dropdown', 'businessArea')
                .withValidator('required', 'Business area is required')
                .withProp('label', 'Business Area')
                .withProp('disabled', isReadOnly)
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
            Component('dropdown', 'businessUnit')
                .withValidator('required', 'Business unit is required')
                .withProp('label', 'Business Unit')
                .withProp('disabled', isReadOnly)
                .withProp('conditionChoices', [
                    ConditionChoice('businessArea', 'UKVI', 'S_MPAM_BUS_UNITS_1'),
                    ConditionChoice('businessArea', 'BF', 'S_MPAM_BUS_UNITS_2'),
                    ConditionChoice('businessArea', 'IE', 'S_MPAM_BUS_UNITS_3'),
                    ConditionChoice('businessArea', 'EUSS', 'S_MPAM_BUS_UNITS_4'),
                    ConditionChoice('businessArea', 'HMPO', 'S_MPAM_BUS_UNITS_5'),
                    ConditionChoice('businessArea', 'Windrush', 'S_MPAM_BUS_UNITS_6'),
                    ConditionChoice('businessArea', 'Coronavirus', 'S_MPAM_BUS_UNITS_7')
                ])
                .build()
        )
        .withField(
            Component('date', 'contributionRequestDate')
                .withValidator('required', 'Contribution request date is required')
                .withValidator('isValidDate', 'Contribution request date must be a valid date')
                .withValidator('isBeforeToday', 'Contribution request date must be in the past')
                .withProp('label', 'Contribution request date')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required', 'Contribution due date is required')
                .withValidator('isValidDate', 'Contribution due date must be a valid date')
                .withValidator('isAfterToday', 'Contribution due date must not be in the past')
                .withProp('label', 'Contribution due date')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('text-area', 'contributionRequestNote')
                .withValidator('required', 'What you are requesting is required')
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
