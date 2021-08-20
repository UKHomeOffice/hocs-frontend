const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');
const { getSomuItem } = require('../../../middleware/somu');

module.exports = async options => {
    const { data } = await getSomuItem(options);

    return Form()
        .withTitle('Approval Request Fulfillment')
        .withField(
            Component('dropdown', 'contributionBusinessUnit')
                .withValidator('required')
                .withProp('label', 'Approver Role')
                .withProp('choices', 'FOI_APPROVER_ROLES')
                .build()
        )
        .withField(
            Component('date', 'contributionRequestDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isBeforeToday')
                .withProp('label', 'Approval request date')
                .build()
        )
        .withField(
            Component('date', 'contributionDueDate')
                .withValidator('required')
                .withValidator('isValidDate')
                .withValidator('isValidWithinDate')
                .withProp('label', 'Approval due date')
                .build()
        )
        .withField(
            Component('radio', 'contributionStatus')
                .withProp('label', 'Approval Status')
                .withProp('choices', [
                    Choice('Complete', 'contributionReceived'),
                    Choice('Cancelled', 'contributionCancelled')
                ])
                .build()
        )
        .withField(
            Component('radio', 'decision')
                .withValidator('required')
                .withProp('label', 'Decision')
                .withProp('choices', [
                    Choice('Approve', 'approved'),
                    Choice('Reject', 'rejected')
                ])
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'contributionStatus',
                        'conditionPropertyValue': 'contributionReceived'
                    }
                ])
                .build()
        )
        .withField(
            Component('date', 'approvalReceivedDate')
                .withValidator('required')
                .withValidator('isValidDate',)
                .withValidator('isBeforeToday')
                .withValidator('isValidWithinDate')
                .withProp('label', 'Approval received date')
                .withProp('visibilityConditions', [
                    {
                        'conditionPropertyName': 'contributionStatus',
                        'conditionPropertyValue': 'contributionReceived'
                    }
                ])
                .build()
        ).withField(
            Component('text', 'case-reference')
                .withProp('label', 'Approver Name')
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
                .withValidator('required', 'Approval completion notes is required')
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
                .withValidator('required', 'Approval cancellation reason is required')
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
