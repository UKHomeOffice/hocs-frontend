import React from 'react';
import DocumentSummary from '../document-summary.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const mockDocuments = [
    {
        type: 'DOCUMENT_TYPE',
        name: 'DOCUMENT_NAME',
        status: 'DOCUMENT_STATUS',
        uuid: 'UUID',
        timestamp: 'DOCUMENT_TIMESTAMP'
    }
];

describe('Document summary component', () => {

    it('should render with default props', () => {
        const wrapper = render(<DocumentSummary documents={mockDocuments} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});
