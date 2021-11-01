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
        .withTitle(`${isAdd ? 'Add' : isReadOnly ? 'View' : 'Edit'} Approval Request`)
        .withField(
            Component('dropdown', 'approvalRequestForBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Approver Role')
                .withProp('disabled', isReadOnly)
                .withProp('choices', 'FOI_APPROVER_ROLES')
                .build()
        )
        .withField(
            Component('date', 'approvalRequestCreatedDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isBeforeToday')
                .withProp('label', 'Approval request date')
                .withProp('disabled', isReadOnly)
                .build()
        )
        .withField(
            Component('date', 'approvalRequestDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidWithinDate')
                .withProp('label', 'Approval due date')
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
