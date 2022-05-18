import React from 'react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../side-bar';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';


const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const MOCK_CONFIG = {
    page
};

describe('Side bar component', () => {


    it('should render with default props', () => {
        const defaultProps = {
            summary: {
                type: 'default'
            },
            page: page,
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...defaultProps }}>
                <MemoryRouter>
                    <SideBar page={page} summary={defaultProps.summary} />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with supplied tabs', () => {
        const props = {
            caseConfig : {
                type: 'case type',
                tabs: [
                    {
                        name: 'documents',
                        label: 'Documents',
                        screen: 'DOCUMENTS'
                    },
                    {
                        name: 'summary',
                        label: 'Summary',
                        screen: 'SUMMARY'
                    },
                ]
            },
            activeTab: 'DOCUMENTS'
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should show the correct tab when param is passed', () => {
        const props = {
            caseConfig : {
                type: 'case type',
                tabs: [
                    {
                        name: 'documents',
                        label: 'Documents',
                        screen: 'DOCUMENTS'
                    },
                    {
                        name: 'timeline',
                        label: 'Timeline',
                        screen: 'TIMELINE'
                    },
                ]
            }
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should hide the people tab for WCS', () => {
        const props = {
            summary: {
                type: 'WCS'
            }
        };

        // eslint-disable-next-line no-undef
        window.history.pushState({}, 'Test Title', '/test?tab=TIMELINE');

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should show the leftmost tab when no param is passed', () => {
        const props = {
            summary: {
                type: 'case type'
            },
            caseConfig : {
                type: 'case type',
                tabs: [
                    {
                        name: 'timeline',
                        label: 'Timeline',
                        screen: 'TIMELINE'
                    },
                    {
                        name: 'summary',
                        label: 'Summary',
                        screen: 'SUMMARY'
                    },
                ]
            }
        };

        // eslint-disable-next-line no-undef
        window.history.pushState({}, 'Test Title', '/test?tab=TIMELINE');

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(screen.getByText('Add case note')).toBeInTheDocument();
    });

});
