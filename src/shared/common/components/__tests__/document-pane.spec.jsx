import React from 'react';
import WrappedDocumentPane from '../document-pane';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve())
}));

describe('Document pane component', () => {

    let mockDispatch;
    const mockPage = { caseId: 'MOCK_CASE_ID' };

    const documentList = [
        { name: 'TEST_DOCUMENT_1', document_uuid: 'MOCK_DOC_ID_1', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_1', s3_orig_link: 'MOCK_ORIG_LINK_1' },
        { name: 'TEST_DOCUMENT_2', document_uuid: 'MOCK_DOC_ID_2', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_2', s3_orig_link: 'MOCK_ORIG_LINK_2' },
        { name: 'TEST_DOCUMENT_3', document_uuid: 'MOCK_DOC_ID_3', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_3', s3_orig_link: 'MOCK_ORIG_LINK_3' },
    ];

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        mockDispatch.mockReset();
    });

    it('should have the dispatch method in props from the context consumer', () => {
        const outer = shallow(<WrappedDocumentPane />);
        const DocumentPane = outer.props().children;
        const wrapper = mount(<DocumentPane dispatch={mockDispatch} page={mockPage} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.props().dispatch).toBeDefined();
    });

    it('should render the document list and store an active document in state when documents passed in props', () => {
        const outer = shallow(<WrappedDocumentPane />);
        const DocumentPane = outer.props().children;
        const wrapper = mount(<DocumentPane dispatch={mockDispatch} page={mockPage} documents={documentList} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.props().dispatch).toBeDefined();
        expect(wrapper.props().documents).toBeDefined();
    });

});