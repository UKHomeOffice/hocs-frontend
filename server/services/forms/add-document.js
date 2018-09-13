const Form = require('./form-builder');

module.exports = options => Form()
    .withTitle('Add documents to case')
    .withField({
        component: 'dropdown',
        validation: [
            'required'
        ],
        props: {
            name: 'document_type',
            label: 'Document type',
            choices: [
                { label: 'Original', value: 'ORIGINAL' },
                { label: 'Draft', value: 'DRAFT' }
            ]
        }
    })
    .withField({
        component: 'add-document',
        validation: [
            'hasWhitelistedExtension',
            'fileLimit',
            'required'
        ],
        props: {
            name: 'add_document',
            action: 'ADD_DOCUMENT',
            documentType: 'ORIGINAL',
            label: 'Documents',
            allowMultiple: true,
            whitelist: 'DOCUMENT_EXTENSION_WHITELIST'
        }
    })
    .withPrimaryActionLabel('Add')
    .withSecondaryAction({
        component: 'backlink',
        props: {
            label: 'Back',
            action: `/case/${options.caseId}/stage/${options.stageId}/entity/document/manage`
        }
    })
    .build();