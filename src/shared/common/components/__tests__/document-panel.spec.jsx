import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DocumentPanel } from '../document-panel.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve())
}));

describe('Document panel component', () => {

    let mockDispatch;
    const mockPage = { params: { caseId: 'MOCK_CASE_ID' } };

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

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        mockDispatch.mockReset();
    });

    test('should render the document panel', () => {
        const wrapper = render(<DocumentPanel dispatch={mockDispatch} page={mockPage} documents={documentList} />, { wrapper: MemoryRouter });
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Manage Documents')).toBeInTheDocument();
    });

});
