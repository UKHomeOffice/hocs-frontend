const Form = require('./form-builder');
const { infoServiceClient } = require('../../libs/request');

module.exports = async options => {
    const response = await infoServiceClient.get(`/member/${options.context}/address`);
    return Form()
        .withTitle('Member details')
        .withField({
            component: 'dropdown',
            validation: [
                'required'
            ],
            props: {
                name: 'type',
                label: 'Correspondent type',
                choices: 'CORRESPONDENT_TYPES',
                disabled: true
            }
        })
        .withField({
            component: 'text',
            validation: [
                'required'
            ],
            props: {
                name: 'fullname',
                label: 'Full Name'
            }
        })
        .withField({
            component: 'text',
            props: {
                name: 'address1',
                label: 'Building'
            }
        })
        .withField({
            component: 'text',
            props: {
                name: 'address2',
                label: 'Street'
            }
        })
        .withField({
            component: 'text',
            props: {
                name: 'address3',
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
                name: 'telephone',
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
                action: `/case/${options.caseId}/stage/${options.stageId}/entity/correspondent/add`
            }
        })
        .withData({ ...response.data, type: 'MEMBER' })
        .build();
};