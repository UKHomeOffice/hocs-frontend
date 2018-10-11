import React from 'react';
import Dashboard from '../dashboard.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../forms/card.jsx', () => () => ('MOCK_CARD'));

describe('Dashboard component', () => {

    const MOCK_USER_QUEUE = { label: 'Mock user queue', count: 0 };
    const DEFAULT_PROPS = {
        dashboard: {
            user: MOCK_USER_QUEUE,
            teams: [],
        }
    };

    it('should render with default props', () => {
        const WRAPPER = render(<Dashboard {...DEFAULT_PROPS} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should pass user tags when provided in the dashboard user object', () => {
        const PROPS = {
            dashboard: {
                ...DEFAULT_PROPS.dashboard,
                user: { label: 'Mock user queue', count: 0, tags: { overdue: 1 } }
            }
        };
        const WRAPPER = render(<Dashboard {...PROPS} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should pass render teams when provided in dashboard object', () => {
        const PROPS = {
            dashboard: {
                ...DEFAULT_PROPS.dashboard,
                teams: [
                    { label: 'Team A', items: [] }
                ]
            }
        };
        const WRAPPER = render(
            <MemoryRouter>
                <Dashboard {...PROPS} />
            </MemoryRouter>
        );
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should pass render workflows when provided in dashboard object', () => {
        const PROPS = {
            dashboard: {
                ...DEFAULT_PROPS.dashboard,
                teams: [
                    {
                        label: 'Team A', items: [
                            { label: 'Workflow A', items: [] }
                        ]
                    }
                ]
            }
        };
        const WRAPPER = render(
            <MemoryRouter>
                <Dashboard {...PROPS} />
            </MemoryRouter>
        );
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should pass render stages when provided in dashboard object', () => {
        const PROPS = {
            dashboard: {
                ...DEFAULT_PROPS.dashboard,
                teams: [
                    {
                        label: 'Team A', items: [
                            {
                                label: 'Workflow A', items: [
                                    { label: 'Stage A', count: 5, tags: { overdue: 1, allocated: 1 } }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        const WRAPPER = render(
            <MemoryRouter>
                <Dashboard {...PROPS} />
            </MemoryRouter>
        );
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

});