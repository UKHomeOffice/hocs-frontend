const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Remove correspondent')
    .withField({
        component: 'paragraph',
        props: {
            children: 'Remove <CORRESPONDENT> from case?'
        }
    })
    .withPrimaryActionLabel('Remove')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}`
        }
    })
    .build();