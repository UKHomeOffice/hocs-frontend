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
                                    Choice('Email', 'EMAIL', {}),
                                    Choice('Post', 'POST', {})
                                ])
                                .build()
                        )
                        .withField(
                            Component('heading', 'case-view-heading')
                                .withProp('label', 'Correspondent Details')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    },{
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Fullname')
                                .withValidator('required')
                                .withProp('label', 'Full Name')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    },{
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        ).withField(
                            Component('text', 'Organisation')
                                .withProp('label', 'Organisation (Optional)')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    },{
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        ).withField(
                            Component('text', 'Address1')
                                .withValidator('required')
                                .withProp('label', 'Building')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Address2')
                                .withValidator('required')
                                .withProp('label', 'Street')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Address3')
                                .withValidator('required')
                                .withProp('label', 'Town or City')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Postcode')
                                .withValidator('required')
                                .withProp('label', 'Postcode')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('dropdown', 'Country')
                                .withValidator('required')
                                .withProp('label', 'Country')
                                .withProp('choices', 'COUNTRIES_CURRENT')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    },{
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Email')
                                .withValidator('required')
                                .withProp('label', 'Email Address')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('text', 'Email')
                                .withProp('label', 'Email Address (Optional)')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        ).withField(
                            Component('text', 'Reference')
                                .withProp('label', 'Requester\'s Reference (Optional)')
                                .withProp('visibilityConditions', [
                                    {
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'EMAIL'
                                    },{
                                        'conditionPropertyName': 'OriginalChannel',
                                        'conditionPropertyValue': 'POST'
                                    }
                                ])
                                .build()
                        )
                        .withField(
                            Component('type-ahead', 'Topics')
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
