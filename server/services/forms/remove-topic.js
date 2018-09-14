const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Remove topic')
    .withField({
        component: 'paragraph',
        props: {
            children: 'Remove <TOPIC> from case?'
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