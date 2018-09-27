const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add topic to case')
    .withField({
        component: 'type-ahead',
        validation: [
            'required'
        ],
        props: {
            name: 'topic',
            label: 'Topic',
            choices: 'TOPICS_CASETYPE'
        }
    })
    .withPrimaryActionLabel('Add')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}`
        }
    })
    .build();