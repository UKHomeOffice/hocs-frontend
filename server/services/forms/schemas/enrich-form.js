const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');
const getLogger = require('../../../libs/logger');

const receivedByMethodOptions = [{
    label: 'Email',
    value: 'EMAIL'
},{
    label: 'Post',
    value: 'POST'
}];

/**
 * Create the fields for the case creation stage.
 */
const enrichmentDataFormFields = {
    ACTION: {
        CREATE: {
            DOCUMENT: {
                FOI: {
                    add: () => Form()
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
                                        // conditionalContent: { label: 'Reason', description: 'Please enter the reason for this extension' } 
                                        conditionalContentAfter: [
                                            { name:'yesNo', type: 'radio', label: 'Yes or No', afterContent: [
                                                { name:'yes', label: 'yes', value: 'YES'},
                                                { name:'no', label: 'no', value: 'NO'}
                                            ]},
                                            { name:'textYes', type: 'textarea', label: 'Text Area for words', defualtValue:'defualtValue', rows:'4'}
                                        ]
                                    }),
                                    Choice('Post', 'POST', {
                                        conditionalContentAfter: [
                                            { name:'yesNo', type: 'radio', label: 'Yes or No', afterContent: [
                                                { name:'no', label: 'no', value: 'NO'},
                                                { name:'yes', label: 'yes', value: 'YES'}
                                            ]
                                        }]
                                    })
                                ])
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
                        // .withField(
                        //     Component('text', 'fullname')
                        //         .withValidator('required', 'The correspondent\'s full name is required')
                        //         .withProp('label', 'Full Name')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'address1')
                        //         .withProp('label', 'Building')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'address2')
                        //         .withProp('label', 'Street')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'address3')
                        //         .withProp('label', 'Town or City')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'postcode')
                        //         .withProp('label', 'Postcode')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('dropdown', 'country')
                        //         .withProp('label', 'Country')
                        //         .withProp('choices', [
                        //             Choice('United Kingdom', 'United Kingdom'),
                        //             Choice('Other', 'Other')
                        //         ])
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'telephone')
                        //         .withProp('label', 'Telephone')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text', 'email')
                        //         .withProp('label', 'Email Address')
                        //         .build()
                        // )
                        // .withField(
                        //     Component('text-area', 'reference')
                        //         .withProp('label', 'Enter any references given')
                        //         .build()
                        // )
                        .build()
                }
                ,
                MIN: {
                    add: () => Form()
                        .withField(
                            Component('text-area', 'RequestQuestion')
                                .withValidator('required')
                                .withProp('label', 'Request Question')
                                .build()
                        )
                        .build()
                }
            }
        }
    }
};

module.exports.enrich = (context, workflow, action, entity) => {
    const logger = getLogger();
    const dataFields = enrichmentDataFormFields;
    const fieldsToAdd = dataFields[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
    logger.info('GET_FORM_ENRICHMENTS',{ context, workflow, action, entity });
    if (fieldsToAdd && fieldsToAdd.add) {
        return [ ...fieldsToAdd.add().schema.fields ];
    }
    logger.debug('NO_FORM_ENRICHMENTS_FOUND',{ context, workflow, action, entity });
    return {};
};
