jest.mock('../creation-document-tag.json', () => (
    {
        'TEST': 'TEST_TYPE'
    }
),
{ virtual: true });

const { fetchCaseTypeCreationDocumentTag } = require('../case-type');

describe('Case type configuration', () => {

    describe('initial document tag', () => {

        test('should return undefined if case type does not exist', () => {
            expect(fetchCaseTypeCreationDocumentTag('UNKNOWN')).not.toBeDefined();
        });

        test('should return value if case type in config', () => {
            expect(fetchCaseTypeCreationDocumentTag('TEST')).toEqual('TEST_TYPE');
        });

    });

});
