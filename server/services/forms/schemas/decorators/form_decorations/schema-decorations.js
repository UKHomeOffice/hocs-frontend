const Form = require('../../../form-builder');
const { Component, Choice } = require('../../../component-builder');

const receivedByMethodOptions = [{
    label: 'Email',
    value: 'EMAIL'
}, {
    label: 'Post',
    value: 'POST'
}];


/**
 * Create the fields for the case creation stage.
 */
module.exports = {
    ACTION: {
        CREATE: {
            DOCUMENT: {
                FOI: {
                    add: (initialForm) => Form(initialForm)
                        .withField(
                            Component('date', 'KimuDateReceived')
                                .withValidator('required', 'Date correspondence received in KIMU is required')
                                .withValidator('isValidDate', 'Date correspondence received in KIMU must be a valid date')
                                .withValidator('isBeforeToday', 'Date correspondence received in KIMU cannot be in the future')
                                .withProp('label', 'Date correspondence received in KIMU')
                                .withProp('hint', 'For example, 30 01 2021')
                                .build()
                        )
                        .withField(
                            Component('radio', 'OriginalChannel', receivedByMethodOptions)
                                .withValidator('required')
                                .withProp('label', 'How was the request received?')
                                .withProp('choices', [
                                    Choice('Email', 'EMAIL', {
                                        conditionalContentAfterTitle: 'Correspondent Details', conditionalContentAfter: [
                                            { type: 'textarea', name: 'Fullname', label: 'Full Name', rows: '1', validation: { type: 'required' } },
                                            {
                                                type: 'dropdown', name: 'Country', label: 'Country', validation: { type: 'required' }, choices: [
                                                    { label: '', value: '' },
                                                    { label: 'United Kingdom', value: 'United Kingdom', },
                                                    { label: 'Other', value: 'Other' }
                                                ]
                                            },
                                            { type: 'textarea', name: 'Email', label: 'Email Address', rows: '1', validation: { type: 'required' } },
                                            { type: 'textarea', name: 'Reference', label: 'Requester\'s Reference (Optional)', rows: '1' }
                                        ]
                                    }),
                                    Choice('Post', 'POST', {
                                        conditionalContentAfterTitle: 'Correspondent Details', conditionalContentAfter: [
                                            { type: 'textarea', name: 'Fullname', label: 'Full Name', rows: '1', validation: { type: 'required' } },
                                            { type: 'textarea', name: 'Address1', label: 'Building', rows: '1', validation: { type: 'required' } },
                                            { type: 'textarea', name: 'Address2', label: 'Street', rows: '1', validation: { type: 'required' } },
                                            { type: 'textarea', name: 'Address3', label: 'Town or City', rows: '1', validation: { type: 'required' } },
                                            { type: 'textarea', name: 'Postcode', label: 'Postcode', rows: '1', validation: { type: 'required' } },
                                            { type: 'dropdown', name: 'Country', label: 'Country', validation: { type: 'required' }, choices: [
                                                { label: '', value: '' },
                                                { label: 'United Kingdom', value: 'United Kingdom' },
                                                { label: 'Other', value: 'Other' }
                                            ] },
                                            { type: 'textarea', name: 'Email', label:'Email Address (Optional)', rows: '1' },
                                            { type: 'textarea', name: 'Reference', label:'Requester\'s Reference (Optional)', rows: '1' }
                                        ]
                                    })
                                ])
                                .build()
                        )
                        .withField(
                            Component('dropdown', 'FoiType')
                                .withValidator('required')
                                .withProp('label', 'FOI Type')
                                .withProp('choices', 'S_FOI_TYPES')
                                .build()
                        )
                        .withField(
                            Component('dropdown', 'Topics')
                                .withValidator('required')
                                .withProp('label', 'Case Topic')
                                .withProp('choices', 'TOPICS_FOI')
                                .withProp('defaultOptions', true)
                                .build()
                        )
                        .withField(
                            Component('text-area', 'RequestQuestion')
                                .withValidator('required')
                                .withProp('label', 'Request Question')
                                .build()
                        )
                        .withData({
                            'KimuDateReceived': new Date().toISOString().substr(0, 10)
                        })
                        .build()
                }
            }
        }
    }
};
