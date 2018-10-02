const { DOCUMENT_BULK_LIMIT } = require('../../config').forContext('server');
const Form = require('./form-builder');

module.exports = () => Form()
    .withTitle('Create a new case')
    .withField({
        component: 'date',
        validation: [
            'required'
        ],
        'props': {
            name: 'DateReceived',
            label: 'When was the correspondence received?'
        }
    })
    .withField({
        component: 'add-document',
        validation: [
            'hasWhitelistedExtension',
            'fileLimit'
        ],
        props: {
            name: 'add_document',
            action: 'ADD_DOCUMENT',
            hint: `There is a limit of ${DOCUMENT_BULK_LIMIT} files`,
            documentType: 'ORIGINAL',
            className: 'button-secondary-action',
            label: 'Are there any documents to include?',
            allowMultiple: true,
            whitelist: 'DOCUMENT_EXTENSION_WHITELIST'
        }
    })
    .withPrimaryActionLabel('Finish')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Cancel'
        }
    })
    .withData({
        'DateReceived': new Date().toISOString().substr(0, 10)
    })
    .build();