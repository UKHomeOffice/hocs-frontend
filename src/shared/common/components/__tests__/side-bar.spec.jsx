import React from 'react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../side-bar';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const MOCK_CONFIG = {
    page
};

const history = {};

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
                    <SideBar page={page} summary={defaultProps.summary} history={history}/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with supplied tabs', () => {
        const props = {
            caseTabs: [
                {
                    'type': 'DOCUMENTS',
                    'label': 'Documents'
                },
                {
                    'type': 'TIMELINE',
                    'label': 'Timeline'
                },
            ],
            activeTab: 'DOCUMENTS',
            summary: {}
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} history={history}/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should show the correct tab when param is passed', () => {
        const props = {
            summary: {},
            caseTabs: [
                {
                    'type': 'DOCUMENTS',
                    'label': 'Documents'
                },
                {
                    'type': 'TIMELINE',
                    'label': 'Timeline'
                },
            ],
        };

        // eslint-disable-next-line no-undef
        window.history.pushState({}, 'Test Title', '/test?tab=TIMELINE');

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} history={history}/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should not render tab when not enabled for type', () => {
        const props = {
            summary: {
                type: 'WCS'
            },
            caseTabs: [
                {
                    'type': 'DOCUMENTS',
                    'label': 'Documents'
                }
            ]
        };

        // eslint-disable-next-line no-undef
        window.history.pushState({}, 'Test Title', '/test?tab=PEOPLE');

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar page={page} summary={props.summary} history={history}/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });
});
