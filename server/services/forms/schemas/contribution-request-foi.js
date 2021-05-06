const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');

const ACTIONS = {
    ADD_REQUEST: 'ADDREQUEST',
    EDIT_REQUEST: 'EDITREQUEST',
    VIEW_REQUEST: 'VIEWREQUEST',
};

module.exports = async options => {
    const action = options.action;
    const isAdd = action ? action.toUpperCase() === ACTIONS.ADD_REQUEST : false;
    const isReadOnly = action ? action.toUpperCase() === ACTIONS.VIEW_REQUEST : true;
    const { data } = !isAdd ? await getSomuItem(options) : {};

    const form = Form()
        .withTitle(`${isAdd ? 'Add' : isReadOnly ? 'View' : 'Edit'} Contribution Request`)
        .withField(
            Component('dropdown', 'contributionBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Business Unit')
                .withProp('disabled', isReadOnly)
                .withProp('choices', 'S_FOI_DIRECTORATES')
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
