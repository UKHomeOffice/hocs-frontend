const { DOCUMENT_BULK_LIMIT } = require('../../config').forContext('server');

module.exports = {
    title: 'Bulk Create Cases',
    defaultActionLabel: 'Finish',
    fields: [
        {
            component: 'date',
            validation: [
                'required'
            ],
            props: {
                name: 'DateReceived',
                label: 'Date Received'
            }
        },
        {
            component: 'add-document',
            validation: [
                'required',
                'hasWhitelistedExtension',
                'fileLimit'
            ],
            props: {
                name: 'add_document',
                action: 'ADD_DOCUMENT',
                hint: `There is a limit of ${DOCUMENT_BULK_LIMIT} files`,
                documentType: 'ORIGINAL',
                className: 'button-secondary-action',
                label: 'Documents',
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