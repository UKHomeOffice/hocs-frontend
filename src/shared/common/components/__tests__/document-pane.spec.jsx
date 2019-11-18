import React from 'react';
import WrappedDocumentPanel from '../document-pane';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve())
}));

describe('Document pane component', () => {

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

    it('should have the dispatch method in props from the context consumer', () => {
        const outer = shallow(<WrappedDocumentPanel />);
        const DocumentPanel = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <DocumentPanel dispatch={mockDispatch} page={mockPage} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentPanel').props().dispatch).toBeDefined();
    });

    it('should render the document list and store an active document in state when documents passed in props', () => {
        const outer = shallow(<WrappedDocumentPanel />);
        const DocumentPanel = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <DocumentPanel dispatch={mockDispatch} page={mockPage} documents={documentList} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentPanel').props().dispatch).toBeDefined();
        expect(wrapper.find('DocumentPanel').props().documents).toBeDefined();
    });

});