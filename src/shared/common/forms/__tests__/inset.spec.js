import React from 'react';
import Inset from '../inset.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Inset component', () => {

    it('should render with default props', () => {
        expect(
            render(<Inset />)
        ).toMatchSnapshot();
    });

    it('should render with content when passed', () => {
        render(<Inset>Testing the Inset component</Inset>);
        expect(screen.getByText('Testing the Inset component')).toBeInTheDocument();
    });

});
