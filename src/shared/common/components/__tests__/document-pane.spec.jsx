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
        { label: 'TEST_DOCUMENT_1', value: 'MOCK_DOC_ID_1', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_1', file_link: 'MOCK_ORIG_LINK_1' },
        { label: 'TEST_DOCUMENT_2', value: 'MOCK_DOC_ID_2', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_2', file_link: 'MOCK_ORIG_LINK_2' },
        { label: 'TEST_DOCUMENT_3', value: 'MOCK_DOC_ID_3', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_3', file_link: 'MOCK_ORIG_LINK_3' },
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