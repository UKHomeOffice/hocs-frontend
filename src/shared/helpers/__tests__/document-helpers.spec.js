import {
    flattenDocuments,
    getFirstDocument,
    hasPendingDocuments
} from '../document-helpers';

const documentList = [
    ['group 1', [
        { label: 'TEST_DOCUMENT_1', value: 'MOCK_DOC_ID_1', status: 'UPLOADED' },
        { label: 'TEST_DOCUMENT_2', value: 'MOCK_DOC_ID_2', status: 'UPLOADED' },
        { label: 'TEST_DOCUMENT_3', value: 'MOCK_DOC_ID_3', status: 'PENDING' },
    ]], ['group 2', [
        { label: 'TEST_DOCUMENT_4', value: 'MOCK_DOC_ID_4', status: 'UPLOADED' },
        { label: 'TEST_DOCUMENT_5', value: 'MOCK_DOC_ID_5', status: 'UPLOADED' },
        { label: 'TEST_DOCUMENT_6', value: 'MOCK_DOC_ID_6', status: 'UPLOADED' },
    ]], ['group 3', [
        { label: 'TEST_DOCUMENT_7', value: 'MOCK_DOC_ID_7', status: 'UPLOADED' },
        { label: 'TEST_DOCUMENT_8', value: 'MOCK_DOC_ID_8', status: 'PENDING' },
        { label: 'TEST_DOCUMENT_9', value: 'MOCK_DOC_ID_9', status: 'PENDING' },
    ]]
];

const flattenedDocuments = [
    {
        'label': 'TEST_DOCUMENT_1',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_1'
    },
    {
        'label': 'TEST_DOCUMENT_2',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_2'
    },
    {
        'label': 'TEST_DOCUMENT_3',
        'status': 'PENDING',
        'value': 'MOCK_DOC_ID_3'
    },
    {
        'label': 'TEST_DOCUMENT_4',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_4'
    },
    {
        'label': 'TEST_DOCUMENT_5',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_5'
    },
    {
        'label': 'TEST_DOCUMENT_6',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_6'
    },
    {
        'label': 'TEST_DOCUMENT_7',
        'status': 'UPLOADED',
        'value': 'MOCK_DOC_ID_7'
    },
    {
        'label': 'TEST_DOCUMENT_8',
        'status': 'PENDING',
        'value': 'MOCK_DOC_ID_8'
    },
    {
        'label': 'TEST_DOCUMENT_9',
        'status': 'PENDING',
        'value': 'MOCK_DOC_ID_9'
    }
];

describe('DocumentPanelHelpers', () => {
    describe('flattenDocuments', () => {
        it('returns an empty array when called with invalid value', () => {
            expect(flattenDocuments([])).toStrictEqual([]);
            expect(flattenDocuments('test')).toStrictEqual([]);
            expect(flattenDocuments(null)).toStrictEqual([]);
            expect(flattenDocuments(123)).toStrictEqual([]);
            expect(flattenDocuments(undefined)).toStrictEqual([]);
            expect(flattenDocuments()).toStrictEqual([]);
        });

        it('returns a flat array of documents when called with a valid value', () => {
            expect(flattenDocuments(documentList)).toStrictEqual(flattenedDocuments);
        });
    });

    describe('getFirstDocument', () => {
        it('returns undefined when called with invalid value', () => {
            expect(getFirstDocument([])).toStrictEqual(undefined);
            expect(getFirstDocument('test')).toStrictEqual(undefined);
            expect(getFirstDocument(null)).toStrictEqual(undefined);
            expect(getFirstDocument(123)).toStrictEqual(undefined);
            expect(getFirstDocument(undefined)).toStrictEqual(undefined);
            expect(getFirstDocument()).toStrictEqual(undefined);
        });

        it('returns a flat array of documents when called with a valid value', () => {
            expect(getFirstDocument(flattenedDocuments)).toStrictEqual('MOCK_DOC_ID_1');
        });
    });

    describe('hasPendingDocuments', () => {
        it('returns undefined when called with invalid value', () => {
            expect(hasPendingDocuments([])).toStrictEqual(false);
            expect(hasPendingDocuments('test')).toStrictEqual(false);
            expect(hasPendingDocuments(null)).toStrictEqual(false);
            expect(hasPendingDocuments(123)).toStrictEqual(false);
            expect(hasPendingDocuments(undefined)).toStrictEqual(false);
            expect(hasPendingDocuments()).toStrictEqual(false);
        });

        it('returns a flat array of documents when called with a valid value', () => {
            expect(hasPendingDocuments(flattenedDocuments)).toStrictEqual(true);
        });
    });
});
