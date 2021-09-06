const { DOCUMENT_BULK_LIMIT } = require('../../../config').forContext('server');
const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { MIN_ALLOWABLE_YEAR } = require('../../../libs/dateHelpers');

module.exports = (options) => {
    const fromCaseUUID = options?.data?.from ? options.data.from : '';

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
            Component('add-document', 'add_document')
                .withValidator('hasWhitelistedExtension')
                .withValidator('fileLimit')
                .withValidator('required')
                .withProp('label', 'There must be a least 1 document to upload.')
                .withProp('hint', `There is a limit of ${DOCUMENT_BULK_LIMIT} documents`)
                .withProp('allowMultiple', true)
                .withProp('whitelist', 'DOCUMENT_EXTENSION_WHITELIST')
                .build()
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
}
