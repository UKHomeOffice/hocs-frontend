import React from 'react';
import EntityList from '../entity-list.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ApplicationProvider } from '../../../../contexts/application';

describe('Entity list component', () => {

    const PAGE = { params: { caseId: '1234', stageId: '5678' } };
    const NAME = 'entity_list';
    const ENTITY = 'entity';
    const BASE_URL = 'http://localhost:8080';
    const MOCK_CALLBACK = jest.fn();
    const MOCK_CONFIG = {
        page: PAGE,
        baseUrl: BASE_URL,
    };

    const DEFAULT_PROPS = {
        page: PAGE,
        name: NAME,
        entity: ENTITY,
        baseUrl: BASE_URL,
        updateState: MOCK_CALLBACK
    };

    beforeEach(() => {
        MOCK_CALLBACK.mockReset();
    });

    test('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...DEFAULT_PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
    });

    test('should render with label when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            label: 'Test entity list'
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test entity list')).toBeInTheDocument();
    });

    test('should render with hint when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            hint: 'Select one of the below entities'
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Select one of the below entities')).toBeInTheDocument();
    });

    test('should render with error when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: 'Validation has failed'
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Validation has failed')).toBeInTheDocument();
    });

    test('should render with remove link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasRemoveLink: true
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByText('Remove')).toHaveLength(2);
    });

    test('should suppress remove link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasRemoveLink: true,
            hideRemovePrimary: true
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByText('Remove')).toHaveLength(2);
    });

    test('should render with edit link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasEditLink: true
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByText('Edit')).toHaveLength(2);
    });

    test('should render with add link when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            hasAddLink: true
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Add a entity')).toBeInTheDocument();
    });

    it('should execute callback on initialization', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: []
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(MOCK_CALLBACK).toHaveBeenCalledTimes(1);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: null });
    });

    it('should execute callback on change', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ]
        };
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...PROPS }}>
                <MemoryRouter>
                    <EntityList
                        {...PROPS}
                    />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();

        MOCK_CALLBACK.mockReset();

        fireEvent.click(wrapper.getAllByRole('radio')[1]);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: choice('B').value });

        fireEvent.click(wrapper.getAllByRole('radio')[0]);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: choice('A').value });
    });
});
