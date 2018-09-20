const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add topic to case')
    .withField({
        component: 'dropdown',
        validation: [
            'required'
        ],
        props: {
            name: 'parent_topic',
            label: 'Parent topic',
            choices: 'CASE_PARENT_TOPICS'
        }
    })
    .withPrimaryActionLabel('Get topics')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}`
        }
    })
    .build();