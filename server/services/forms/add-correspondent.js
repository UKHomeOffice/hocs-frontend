const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add correspondent to case')
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
            name: 'postcode',
            label: 'Postcode'
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
        component: 'checkbox',
        props: {
            name: 'isCorrespondentInTheUK',
            className: 'inline',
            choices: [
                {
                    label: 'Is the correspondent in the UK?',
                    value: 'is_in_uk'
                }
            ]
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
            name: 'phone',
            label: 'Telephone'
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