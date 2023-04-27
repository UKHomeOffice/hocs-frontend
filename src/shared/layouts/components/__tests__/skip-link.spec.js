import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SkipLink from '../skip-link';

describe('Skip link component', () => {
    it('should render', () => {
        const wrapper = render(<SkipLink />);

        expect(wrapper).toBeDefined();
        expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });
});
