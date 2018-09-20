const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add topic to case')
    .withField({
        component: 'dropdown',
        validation: [
            'required'
        ],
        props: {
            name: 'topic',
            label: 'Topic',
            choices: 'CASE_TOPICS'
        }
    })
    .withPrimaryActionLabel('Add')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}/entity/topic/add`
        }
    })
    .build();