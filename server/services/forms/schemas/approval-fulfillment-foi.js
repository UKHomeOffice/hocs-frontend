const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');

module.exports = async options => {
    const { data } = await getSomuItem(options);

    return Form()
        .withTitle('Approval Request Fulfillment')
        .withField(
            Component('dropdown', 'approvalRequestForBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Approver Role')
                .withProp('choices', 'FOI_APPROVER_ROLES')
                .build()
        )
        .withField(
            Component('date', 'approvalRequestCreatedDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isBeforeToday')
                .withProp('label', 'Approval request date')
                .build()
        )
        .withField(
            Component('date', 'approvalRequestDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidWithinDate')
                .withProp('label', 'Approval due date')
                .build()
        )
        .withField(
            Component('radio', 'approvalRequestStatus')
                .withProp('label', 'Approval Status')
                .withProp('choices', [
                    Choice('Complete', 'approvalRequestResponseReceived'),
                    Choice('Cancelled', 'approvalRequestCancelled')
                ])
                .build()
        )
        .withField(
            Component('radio', 'approvalRequestDecision')
                .withValidator('required')
                .withProp('label', 'Decision')
                .withProp('choices', [
                    Choice('Approve', 'approved'),
                    Choice('Reject', 'rejected')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'approvalRequestStatus',
                        'conditionPropertyValue': 'approvalRequestResponseReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('date', 'approvalRequestResponseReceivedDate')
                .withValidator('required')
                .withValidator('isValidDate',)
                .withValidator('isBeforeToday')
                .withValidator('isValidWithinDate')
                .withProp('label', 'Date response received')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'approvalRequestStatus',
                        'conditionPropertyValue': 'approvalRequestResponseReceived'
                    }
                ])
                .build()
        ).withField(
            Component('text', 'approvalRequestResponseBy')
                .withValidator(['required'], 'Respondents name is required')
                .withProp('label', 'Respondents name')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'approvalRequestStatus',
                        'conditionPropertyValue': 'approvalRequestResponseReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('text-area', 'approvalRequestResponseNote')
                .withValidator('required', 'Approval completion notes is required')
                .withProp('label', 'Details')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'approvalRequestStatus',
                        'conditionPropertyValue': 'approvalRequestResponseReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('text-area', 'approvalRequestCancellationNote')
                .withValidator('required', 'Approval cancellation reason is required')
                .withProp('label', 'Reason for cancelling')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'approvalRequestStatus',
                        'conditionPropertyValue': 'approvalRequestCancelled'
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
