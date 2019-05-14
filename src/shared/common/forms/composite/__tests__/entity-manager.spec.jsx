import React from 'react';
import EntityManager from '../entity-manager.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Entity list component', () => {

    const PAGE = { caseId: '1234', stageId: '5678' };
    const NAME = 'entity_manager';
    const ENTITY = 'entity';
    const BASE_URL = 'http://localhost:8080';
    const MOCK_CALLBACK = jest.fn();

    const DEFAULT_PROPS = {
        page: PAGE,
        name: NAME,
        entity: ENTITY,
        baseUrl: BASE_URL,
    };

    beforeEach(() => {
        MOCK_CALLBACK.mockReset();
    });

    it('should render with default props', () => {
        const WRAPPER = render(<EntityManager baseUrl={'/'} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with label when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            label: 'Test entity manager'
        };
        const WRAPPER = render(<EntityManager {...PROPS} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with additional css when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            className: 'my-css-class'
        };
        const WRAPPER = render(<EntityManager {...PROPS} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with remove link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasRemoveLink: true
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with add link when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            hasAddLink: true
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with download link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasDownloadLink: true
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with download link when passed in props', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ],
            hasTemplateLink: true
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with tags when passed in props on choice entries', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}`, tags: [value] });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ]
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with created date when passed in props on choice entries', () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}`, created: '2020-01-01' });
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: [
                choice('A'),
                choice('B')
            ]
        };
        const WRAPPER = render(
            <MemoryRouter>
                <EntityManager {...PROPS} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

});