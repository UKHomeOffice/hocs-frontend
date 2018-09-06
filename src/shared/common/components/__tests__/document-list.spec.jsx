import React from 'react';
import DocumentList from '../document-list.jsx';

describe('Document list component', () => {

    const documentList = [
        { name: 'TEST_DOCUMENT_1', document_uuid: 'MOCK_DOC_ID_1', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_1', s3_orig_link: 'MOCK_ORIG_LINK_1' },
        { name: 'TEST_DOCUMENT_2', document_uuid: 'MOCK_DOC_ID_2', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_2', s3_orig_link: 'MOCK_ORIG_LINK_2' },
        { name: 'TEST_DOCUMENT_3', document_uuid: 'MOCK_DOC_ID_3', type: 'ORIGINAL', s3_pdf_link: 'MOCK_S3_LINK_3', s3_orig_link: 'MOCK_ORIG_LINK_3' },
    ];

    it('should render with default props', () => {
        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={() => { }} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with a document list when provided in props', () => {
        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={() => { }} documents={documentList} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should support a click handler when passed in props', () => {
        const mockClickHandler = jest.fn();
        const wrapper = shallow(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={mockClickHandler} documents={documentList} />);
        expect(wrapper).toBeDefined();
        wrapper.find('#MOCK_DOC_ID_1-pdf').simulate('click', { preventDefault: jest.fn() });
        expect(mockClickHandler).toHaveBeenCalled();
    });

});