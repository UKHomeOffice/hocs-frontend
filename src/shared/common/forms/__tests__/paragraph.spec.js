import React from 'react';
import Paragraph from '../paragraph.jsx';

describe('Paragraph component', () => {

    it('should render with default props', () => {
        expect(
            render(<Paragraph />)
        ).toMatchSnapshot();
    });

    it('should render with content when passed', () => {
        expect(
            render(<Paragraph>Testing the Paragraph component</Paragraph>)
        ).toMatchSnapshot();
    });

});