const Form = require('./form-builder');

module.exports = () => Form()
    .withTitle('Create a new case')
    .withField({
        component: 'radio',
        validation: [
            'required'
        ],
        props: {
            name: 'case-type',
            label: 'What type of correspondence do you have?',
            choices: 'CASE_TYPES'
        }
    })
    .withPrimaryActionLabel('Next')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Cancel'
        }
    })
    .build();