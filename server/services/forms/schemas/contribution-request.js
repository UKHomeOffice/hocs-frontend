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
            Component('dropdown', 'contributionBusinessArea')
                .withValidator('required')
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
                .build()
        )
        .withField(
            Component('date', 'contributionRequestDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isBeforeToday')
                .withProp('label', 'Contribution request date')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
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
