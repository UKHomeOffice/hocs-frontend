const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Record Correspondent Details')
    .withField({
        component: 'dropdown',
        props: {
            name: 'correspondentType',
            label: 'What is the correspondent type?',
            choices: [
                {
                    label: 'Correspondent',
                    value: 'CORRESPONDENT'
                },
                {
                    label: 'Other',
                    value: 'OTHER'
                }
            ]
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'fullName',
            label: 'Full Name'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'building',
            label: 'Building'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'street',
            label: 'Street'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'townCity',
            label: 'Town or City'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'postcode',
            label: 'Postcode'
        }
    })
    .withField({
        component: 'dropdown',
        props: {
            name: 'country',
            label: 'Country',
            choices: [
                {
                    label: 'United Kingdom',
                    value: 'United Kingdom'
                },
                {
                    label: 'Other',
                    value: 'Other'
                }
            ]
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'phone',
            label: 'Telephone'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'email',
            label: 'Email address'
        }
    })
    .withField({
        component: 'text',
        props: {
            name: 'reference',
            label: 'Does this correspondent give a case reference?'
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