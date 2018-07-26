import React from 'react';
import Inset from '../inset.jsx';

describe('Inset component', () => {

    it('should render with default props', () => {
        expect(
            render(<Inset />)
        ).toMatchSnapshot();
    });

    it('should render with content when passed', () => {
        expect(
            render(<Inset>Testing the Inset component</Inset>)
        ).toMatchSnapshot();
    });

});