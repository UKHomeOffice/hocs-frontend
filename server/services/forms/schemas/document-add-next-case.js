const { DOCUMENT_BULK_LIMIT } = require('../../../config').forContext('server');
const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { MIN_ALLOWABLE_YEAR } = require('../../../libs/dateHelpers');

module.exports = (options) => {
    const fromCaseUUID = options?.data?.from ? options.data.from : '';
    const documentRequired = options.customConfig ? options.customConfig.documentRequired : true;
    const documentLabel = options.customConfig ? options.customConfig.documentLabel : 'There must be a least 1 document to upload.';

    const documentComponent = Component('add-document', 'add_document')
        .withValidator('hasWhitelistedExtension')
        .withValidator('fileLimit')
        .withProp('label', documentLabel)
        .withProp('hint', `There is a limit of ${DOCUMENT_BULK_LIMIT} documents`)
        .withProp('allowMultiple', true)
        .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')

    if (documentRequired) {
        documentComponent.withValidator('required')
    }

    return Form()
        .withTitle('Create Escalate Case')
        .withField(
            Component('date', 'DateReceived')
                .withValidator('required', 'Date received is required')
                .withValidator('isValidDay', 'Date received must contain a real day')
                .withValidator('isValidMonth', 'Date received must contain a real month')
                .withValidator('isYearWithinRange', `Date received must be after ${MIN_ALLOWABLE_YEAR}`)
                .withValidator('isBeforeToday', 'Date received cannot be in the future')
                .withProp('label', 'When was the correspondence received?')
                .build()
        )
        .withField(
            documentComponent.build()
        )
        .withField(
            Component('hidden', 'fromCaseUUID')
                .build()
        )
        .withPrimaryActionLabel('Create case')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Cancel')
                .build()
        )
        .withData({
            'DateReceived': new Date().toISOString().substr(0, 10),
            'fromCaseUUID' : fromCaseUUID
        })
        .build();
};
