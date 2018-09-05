const { DOCUMENT_BULK_LIMIT } = require('../../config').forContext('server');

module.exports = {
    title: 'Create Case',
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
            component: 'date',
            validation: [
                'required'
            ],
            props: {
                name: 'DTENDispatchDeadline',
                label: 'Dispatch Deadline'
            }
        },
        {
            component: 'date',
            validation: [
                'required'
            ],
            props: {
                name: 'DTENDraftDeadline',
                label: 'Draft Deadline'
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