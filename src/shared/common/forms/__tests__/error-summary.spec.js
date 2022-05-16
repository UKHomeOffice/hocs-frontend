import React from 'react';
import ErrorSummary from '../error-summary.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const errors = {
    field1: 'Error 1',
    field2: 'Error 2',
    field3: 'Error 3'
};

describe('Error summary component', () => {
    test('should render with heading when passed', () => {
        const wrapper = render(<ErrorSummary heading="Error summary" />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Error summary')).toBeInTheDocument();
    });
    test('should render with description when passed', () => {
        const wrapper = render(<ErrorSummary description="Displaying a list of the errors on the page" />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Displaying a list of the errors on the page')).toBeInTheDocument();
    });
    test('should render list of errors when passed', () => {
        const wrapper = render(<ErrorSummary errors={errors} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Error 1')).toBeInTheDocument();
        expect(screen.getByText('Error 2')).toBeInTheDocument();
        expect(screen.getByText('Error 3')).toBeInTheDocument();
    });
});
