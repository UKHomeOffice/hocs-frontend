import React from 'react';
import Document from '../document.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Document preview component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Document activeDocument={'MOCK_DOCUMENT_ID'} caseId={'MOCK_CASE_ID'} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});
