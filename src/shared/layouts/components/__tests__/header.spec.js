import React from 'react';
import Header from '../header.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

describe('Layout header component', () => {
    test('should render links', () => {
        const wrapper = render(
            <HelmetProvider>
                <Header
                    viewStandardLinesEnabled={false}
                    service={'Test Service'}
                    serviceLink={'myservicelink.gov.uk'}
                    bulkCreateEnabled={false}
                />
            </HelmetProvider>, { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('Create Single Case')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('should render bulk create links', () => {
        const wrapper = render(
            <HelmetProvider>
                <Header
                    viewStandardLinesEnabled={false}
                    service={'Test Service'}
                    serviceLink={'myservicelink.gov.uk'}
                    bulkCreateEnabled={true}
                />
            </HelmetProvider>, { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('Create Single Case')).toBeInTheDocument();
        expect(screen.getByText('Create Bulk Cases')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});
