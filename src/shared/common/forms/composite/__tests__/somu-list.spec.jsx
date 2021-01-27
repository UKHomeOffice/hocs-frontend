

import React from 'react';
import WrappedSomuList from '../somu-list.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Somu list component', () => {

    const PAGE = { params: { caseId: '1234', stageId: '5678' } };
    const NAME = 'somu_list';
    const ITEM_NAME = 'item';
    const BASE_URL = 'http://localhost:8080';
    const MOCK_CALLBACK = jest.fn();

    const DEFAULT_PROPS = {
        page: PAGE,
        name: NAME,
        itemName: ITEM_NAME,
        baseUrl: BASE_URL,
        updateState: MOCK_CALLBACK
    };

    beforeEach(() => {
        MOCK_CALLBACK.mockReset();
    });

    it('should render with default props', () => {
        const OUTER = shallow(<WrappedSomuList {...DEFAULT_PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(<SomuList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with label when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            label: 'Test somu list'
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(<SomuList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with error when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: 'Validation has failed'
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(<SomuList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with additional when passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            className: 'my-css-class'
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(<SomuList />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with item link passed in props', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestTeam' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
            itemLinks: [
                {
                    'action': 'remove',
                    'label': 'Remove'
                }
            ]
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with default render when table renderer exists', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { table: 'MpamTable' } },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestTeam' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with default render when empty renderer added', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { } },
            active: true };
        const somuItems = [{ uuid: 'test', data: { uuid: 'test', contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestTeam' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with default render when renderers object doesn\'t exist', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestUnit' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with choices when table renderer exists', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { table: 'MpamTable' } },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestTeam' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
            choices: [ {
                'value': 'TestTeam',
                'label': 'Test Team'
            }]
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with add link when passed in props', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { table: 'MpamTable' } },
            active: true };
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            primaryLink: {
                'action': 'add',
                'label': 'Add'
            }
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should execute callback on initialization', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
        };
        const OUTER = shallow(<WrappedSomuList {...PROPS} />);
        const SomuList = OUTER.props().children;
        mount(<SomuList />);
        expect(MOCK_CALLBACK).toHaveBeenCalledTimes(1);
        expect(MOCK_CALLBACK).toHaveBeenCalledWith({ [DEFAULT_PROPS.name]: '[]' });
    });

    it('should include hideSidebar query param on primary and item links', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { } },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea', contributionBusinessUnit: 'TestTeam' }, deleted: false }];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
            hideSidebar: true,
            itemLinks: [
                {
                    'action': 'remove',
                    'label': 'Remove'
                }
            ],
            primaryLink: {
                'action': 'add',
                'label': 'Add'
            }
        };

        const OUTER = shallow(<WrappedSomuList { ...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render status column correctly', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { table: 'MpamTable' } },
            active: true };
        const somuItems = [
            { uuid: 'test',
                data: {
                    contributionBusinessArea: 'TestBusinessArea',
                    contributionBusinessUnit: 'TestTeam',
                    contributionStatus: 'contributionCancelled'
                },
                deleted: false },
            { uuid: 'test',
                data: {
                    contributionBusinessArea: 'TestBusinessArea',
                    contributionBusinessUnit: 'TestTeam',
                    contributionStatus: 'contributionReceived'
                },
                deleted: false },
            { uuid: 'test',
                data: {
                    contributionBusinessArea: 'TestBusinessArea',
                    contributionBusinessUnit: 'TestTeam',
                    contributionDueDate: '2020-01-01'
                },
                deleted: false },
            { uuid: 'test',
                data: {
                    contributionBusinessArea: 'TestBusinessArea',
                    contributionBusinessUnit: 'TestTeam',
                    contributionDueDate:  '2050-01-01'
                },
                deleted: false },
            { uuid: 'test',
                data: {
                    contributionBusinessArea: 'TestBusinessArea',
                    contributionBusinessUnit: 'TestTeam',
                    contributionDueDate: 'xx'
                },
                deleted: false }
        ];
        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
            hideSidebar: true,
            itemLinks: [
                {
                    'action': 'remove',
                    'label': 'Remove'
                }
            ],
            primaryLink: {
                'action': 'add',
                'label': 'Add'
            }
        };

        const OUTER = shallow(<WrappedSomuList { ...PROPS} />);
        const SomuList = OUTER.props().children;
        const WRAPPER = render(
            <MemoryRouter>
                <SomuList page={PAGE} />
            </MemoryRouter>);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

});
