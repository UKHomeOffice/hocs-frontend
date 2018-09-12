const Form = require('./form-builder');

module.exports = () => Form()
    .withTitle('Create new cases in bulk')
    .withField({
        component: 'radio',
        validation: [
            'required'
        ],
        props: {
            name: 'case-type',
            label: 'What type of correspondence do you have?',
            choices: 'CASE_TYPES_BULK'
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