import React from 'react';
import DocumentList from '../document-list.jsx';

describe('Document list component', () => {

    const documentList = [
        { name: 'TEST_DOCUMENT_1', uuid: 'MOCK_DOC_ID_1', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_1', file_link: 'MOCK_ORIG_LINK_1' },
        { name: 'TEST_DOCUMENT_2', uuid: 'MOCK_DOC_ID_2', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_2', file_link: 'MOCK_ORIG_LINK_2' },
        { name: 'TEST_DOCUMENT_3', uuid: 'MOCK_DOC_ID_3', type: 'ORIGINAL', pdf_link: 'MOCK_S3_LINK_3', file_link: 'MOCK_ORIG_LINK_3' },
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