import React from 'react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../side-bar';

const MOCK_TRACK = jest.fn();

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const MOCK_CONFIG = {
    track: MOCK_TRACK,
    page
};

describe('Side bar component', () => {


    it('should render with default props', () => {
        const defaultProps = {
            summary: {
                type: 'default'
            }
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...defaultProps }}>
                <MemoryRouter>
                    <SideBar/>
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
                    'documents',
                    'summary',
                    'actions',
                    'ex_gratia'
                ]
            }
        };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should show the correct tab when param is passed', () => {
        const props = {
            summary: {
                type: 'default'
            }
        };

        // eslint-disable-next-line no-undef
        window.history.pushState({}, 'Test Title', '/test?tab=TIMELINE');

        const WRAPPER = mount(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...props }}>
                <MemoryRouter>
                    <SideBar/>
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER.find('WrappedTimeline').length).toEqual(1);
    });

});
