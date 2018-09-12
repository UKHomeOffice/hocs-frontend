const Form = require('./form-builder');

module.exports = () => Form()
    .withTitle('Add document to case')
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
            label: 'Document',
            allowMultiple: false,
            whitelist: 'DOCUMENT_EXTENSION_WHITELIST'
        }
    })
    .withPrimaryActionLabel('Add')
    .build();