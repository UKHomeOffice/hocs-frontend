import React from 'react';
import Layout from '../layout';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationProvider } from '../../contexts/application';


const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const MOCK_CONFIG = {
    page
};

describe('Page layout component', () => {
    const mockLayout = {
        header: null,
        body: null,
        footer: {}
    };

    it('should render the footer when provided', () => {
        const mockLayoutWithFooter = { ...mockLayout, footer: { isVisible: true } };
        const defaultProps = {
            summary: {
                type: 'default'
            },
            page: page,
            layout: mockLayoutWithFooter,
            config: MOCK_CONFIG
        };

        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...defaultProps }}>
                <MemoryRouter>
                    <Layout />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(wrapper).toBeDefined();
        expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    });
});
