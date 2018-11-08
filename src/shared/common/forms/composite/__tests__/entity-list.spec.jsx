import React from 'react';
import WrappedEntityList from '../entity-list.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Entity list component', () => {

    const PAGE = { params: { caseId: '1234', stageId: '5678' } };
    const NAME = 'entity_list';
    const ENTITY = 'entity';
    const BASE_URL = 'http://localhost:8080';
    const MOCK_CALLBACK = jest.fn();

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

    it('should render with default props', () => {
        const OUTER = shallow(<WrappedEntityList {...DEFAULT_PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(<EntityList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with label when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            label: 'Test entity list'
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(<EntityList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with hint when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            hint: 'Select one of the below entities'
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(<EntityList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with error when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: 'Validation has failed'
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(<EntityList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with additional when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            className: 'my-css-class'
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(<EntityList />);
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
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <EntityList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with add link when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            hasAddLink: true
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <EntityList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should execute callback on initialization', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            choices: []
        };
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        mount(<EntityList />);
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
        const OUTER = shallow(<WrappedEntityList {...PROPS} />);
        const EntityList = OUTER.props().children;
        const INNER = mount(<EntityList />);

        MOCK_CALLBACK.mockReset();

        INNER.find(`#${DEFAULT_PROPS.name}-${choice('A').value}`).simulate('change', { target: { value: choice('A').value } });
        expect(MOCK_CALLBACK).toHaveBeenCalledTimes(1);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: choice('A').value });

        INNER.find(`#${DEFAULT_PROPS.name}-${choice('B').value}`).simulate('change', { target: { value: choice('B').value } });
        expect(MOCK_CALLBACK).toHaveBeenCalledTimes(2);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: choice('B').value });
    });

});