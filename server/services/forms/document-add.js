const { DOCUMENT_BULK_LIMIT } = require('../../config').forContext('server');

module.exports = {
    title: 'Create a new case',
    defaultActionLabel: 'Finish',
    fields: [
        {
            component: 'date',
            validation: [
                'required'
            ],
            'props': {
                name: 'DateReceived',
                label: 'When was the correspondence received?'
            }
        },
        {
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
        }
    ],
    secondaryActions: [
        {
            component: 'backlink',
            props: {
                label: 'Cancel'
            }
        }
    ]
};