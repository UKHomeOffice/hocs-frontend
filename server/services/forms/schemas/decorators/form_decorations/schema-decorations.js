const Form = require('../../../form-builder');
const { Component } = require('../../../component-builder');


const receivedByMethodOptions = [{
    label: 'Email',
    value: 'EMAIL'
},{
    label: 'Post',
    value: 'POST'
}];

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
                                .withProp('choices', receivedByMethodOptions)
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