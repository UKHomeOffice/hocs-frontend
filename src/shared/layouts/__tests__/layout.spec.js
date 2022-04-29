import React from 'react';
import { Layout } from '../layout.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Page layout component', () => {
    const mockLayout = {
        header: {},
        body: {},
        footer: {}
    };

    it('should render the footer when provided', () => {
        const mockLayoutWithFooter = { ...mockLayout, footer: { isVisible: true } };
        const wrapper = render(
            <Layout layout={mockLayoutWithFooter} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    });
});
