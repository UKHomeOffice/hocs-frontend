const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add member of parliament')
    .withField({
        component: 'type-ahead',
        validation: [
            'required'
        ],
        props: {
            name: 'member',
            label: 'Member',
            choices: 'MEMBER_LIST'
        }
    })
    .withPrimaryActionLabel('Add')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}/entity/correspondent/add`
        }
    })
    .build();