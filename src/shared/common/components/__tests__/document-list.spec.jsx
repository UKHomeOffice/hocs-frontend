import React from 'react';
import DocumentList from '../document-list.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Document list component', () => {

    const documentList = [
        ['group 1', [
            { label: 'TEST_DOCUMENT_1', value: 'MOCK_DOC_ID_1', status: 'UPLOADED', hasPdf: true, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_2', value: 'MOCK_DOC_ID_2', status: 'FAILED_CONVERSION', tags: ['Failed Conversion'], hasPdf: false, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_3', value: 'MOCK_DOC_ID_3', status: 'FAILED_VIRUS', tags: ['Failed Virus'], hasPdf: false, hasOriginalFile: false },
            { label: 'TEST_DOCUMENT_4', value: 'MOCK_DOC_ID_4', status: 'PENDING', tags: [], hasPdf: false, hasOriginalFile: true },

        ]], ['group 2', [
            { label: 'TEST_DOCUMENT_5', value: 'MOCK_DOC_ID_5', status: 'UPLOADED', hasPdf: true, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_6', value: 'MOCK_DOC_ID_6', status: 'FAILED_CONVERSION', tags: ['Failed Conversion'], hasPdf: false, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_7', value: 'MOCK_DOC_ID_7', status: 'FAILED_VIRUS', tags: ['Failed Virus'], hasPdf: false, hasOriginalFile: false },
            { label: 'TEST_DOCUMENT_8', value: 'MOCK_DOC_ID_8', status: 'PENDING', tags: ['Pending'], hasPdf: false, hasOriginalFile: true },
        ]], ['group 3', [
            { label: 'TEST_DOCUMENT_9', value: 'MOCK_DOC_ID_9', status: 'UPLOADED', hasPdf: true, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_10', value: 'MOCK_DOC_ID_10', status: 'FAILED_CONVERSION', tags: ['Failed Conversion'], hasPdf: false, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_11', value: 'MOCK_DOC_ID_11', status: 'FAILED_VIRUS',  tags: ['Failed Virus'], hasPdf: false, hasOriginalFile: false },
            { label: 'TEST_DOCUMENT_12', value: 'MOCK_DOC_ID_12', status: 'PENDING', tags: ['UNKNOWN', 'Pending'], hasPdf: false, hasOriginalFile: true },
            { label: 'TEST_DOCUMENT_13', value: 'MOCK_DOC_ID_13', status: 'INVALID', tags: ['INVALID'], hasPdf: false, hasOriginalFile: false },
        ]]
    ];

    test('should render with a document list when provided in props', () => {
        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={() => { }} documents={documentList} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('TEST_DOCUMENT_1')).toBeInTheDocument();
        expect(screen.getByText('TEST_DOCUMENT_6')).toBeInTheDocument();
        expect(screen.getByText('TEST_DOCUMENT_11')).toBeInTheDocument();
        expect(screen.getByText('TEST_DOCUMENT_12')).toBeInTheDocument();
        expect(screen.getByText('TEST_DOCUMENT_13')).toBeInTheDocument();
    });

    test('should support a click handler when passed in props', () => {
        global.testFunc = () => {};
        const testSpy = jest.spyOn(global, 'testFunc');
        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={testSpy} documents={documentList} />);
        expect(wrapper).toBeDefined();

        const button = screen.getAllByText('Preview')[0];
        fireEvent.click(button);
        expect(testSpy).toHaveBeenCalledWith('MOCK_DOC_ID_1');
    });

    test('should display None when there are no documents in a group', () => {
        const emptyDocumentList = [
            ['group 1'], ['group 2', []]
        ];

        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={() => { }} documents={emptyDocumentList} />);
        expect(wrapper).toBeDefined();

        const groupsOfNone = screen.getAllByText('None');
        expect(groupsOfNone).toHaveLength(2);
    });
});
