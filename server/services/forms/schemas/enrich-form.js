const Form = require('../form-builder');
const { Component } = require('../component-builder');
const getLogger = require('../../../libs/logger');

const receivedByMethodOptions = [{
    label: 'Email',
    value: 'EMAIL'
},{
    label: 'Post',
    value: 'POST'
}];

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
                                .withProp('choices', receivedByMethodOptions)
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
    const fieldsToAdd = enrichmentDataFormFields[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
    logger.info('GET_FORM_ENRICHMENTS',{ context, workflow, action, entity });
    if (fieldsToAdd && fieldsToAdd.add) {
        return [ ...fieldsToAdd.add().schema.fields ];
    }
    logger.debug('NO_FORM_ENRICHMENTS_FOUND',{ context, workflow, action, entity });
    return {};
};
