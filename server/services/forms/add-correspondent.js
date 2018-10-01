const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add correspondent')
    .withField({
        component: 'radio',
        validation: [
            'required'
        ],
        props: {
            name: 'isMember',
            label: 'Is the correspondent a member of parliament?',
            choices: [
                {
                    label: 'Yes',
                    value: 'true'
                },
                {
                    label: 'No',
                    value: 'false'
                }
            ]
        }
    })
    .withPrimaryActionLabel('Continue')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}`
        }
    })
    .build();