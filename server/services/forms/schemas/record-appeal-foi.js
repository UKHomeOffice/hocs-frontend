const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = (options) => {
    return Form()
        .withTitle('Appeals')
        .withPrimaryActionLabel('Log Appeal')
        .withField(
            Component('heading', 'log-an-appeal-heading')
                .withProp('label', 'Log an appeal')
                .build()
        ).withField(
            Component('dropdown', 'appealType')
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
        ).withField(
            Component('hidden', 'appealStatus')
                .withProp('label', 'Appeal Status')
                .build()
        ).withData({
            appealStatus: 'appealPending'
        })

        .withSecondaryAction(
            Component('button')
                .withProp('label', 'Cancel')
                .withProp('className', 'govuk-!-margin-left-1 govuk-button--secondary')
                .withProp('preventDefault', 'false')
                .withProp('action',
                    `/case/${options.caseId}/stage/${options.stageId}/somu/${options.somuTypeUuid}/${options.somuType}/${options.somuCaseType}/MANAGE_APPEALS?hideSidebar=false`)
                .build()
        )
        .build();
};
