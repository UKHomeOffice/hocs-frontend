import React from 'react';
import DocumentList from '../document-list.jsx';

describe('Document list component', () => {

    const documentList = [
        ['group 1', [
            { label: 'TEST_DOCUMENT_1', value: 'MOCK_DOC_ID_1', status: 'UPLOADED', tags: ['UPLOADED'] },
            { label: 'TEST_DOCUMENT_2', value: 'MOCK_DOC_ID_2', status: 'UPLOADED', tags: ['UPLOADED'] },
            { label: 'TEST_DOCUMENT_3', value: 'MOCK_DOC_ID_3', status: 'PENDING', tags: ['PENDING'] },
        ]], ['group 2', [
            { label: 'TEST_DOCUMENT_4', value: 'MOCK_DOC_ID_4', status: 'UPLOADED', tags: ['UPLOADED'] },
            { label: 'TEST_DOCUMENT_5', value: 'MOCK_DOC_ID_5', status: 'UPLOADED', tags: ['UPLOADED'] },
            { label: 'TEST_DOCUMENT_6', value: 'MOCK_DOC_ID_6', status: 'UPLOADED', tags: ['UPLOADED'] },
        ]], ['group 3', [
            { label: 'TEST_DOCUMENT_7', value: 'MOCK_DOC_ID_7', status: 'UPLOADED', tags: ['UPLOADED'] },
            { label: 'TEST_DOCUMENT_8', value: 'MOCK_DOC_ID_8', status: 'PENDING', tags: ['PENDING'] },
            { label: 'TEST_DOCUMENT_9', value: 'MOCK_DOC_ID_9', status: 'PENDING', tags: ['PENDING'] },
        ]]
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

    it('should display None when there are no documents in a group', () => {
        const emptyDocumentList = [
            ['group 1'], ['group 2', []]
        ];

        const wrapper = render(<DocumentList caseId={'MOCK_CASE_ID'} clickHandler={() => { }} documents={emptyDocumentList} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
        const cells = wrapper.find('td');
        expect(cells).toHaveLength(2);
        expect(cells.first().text()).toBe('None');
        expect(cells.last().text()).toBe('None');
    });
});
