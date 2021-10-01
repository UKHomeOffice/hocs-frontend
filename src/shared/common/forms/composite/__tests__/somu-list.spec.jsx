

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

    it('should render with MpamTable renderer', () => {
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

    it('should render when CompTable renderer added', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: { renderers: { table: 'CompTable' } },
            active: true };
        const somuItems = [{ uuid: 'test', data: { contributionBusinessArea: 'TestBusinessArea' }, deleted: false }];
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

    it('should render ApprovalTypeTable with Due', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: {
                renderers: {
                    table: 'ApprovalRequestTable'
                }
            },
            active: true };

        const somuItems = [{
            uuid: 'test',
            data: {
                approvalRequestDueDate: '2021-09-01',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestForBusinessUnit: 'TestTeam'
            },
            deleted: false
        }];

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

    it('should render ApprovalTypeTable with 1 Complete - approved, 1 Cancelled, 1 Complete - rejected', () => {
        const somuType = { uuid: 'test',
            caseType: 'tesCaseType',
            type: 'testType',
            schema: {
                renderers: {
                    table: 'ApprovalRequestTable'
                }
            },
            active: true };

        const somuItems = [{
            uuid: 'test - 2',
            data: {
                approvalRequestStatus: 'approvalRequestCancelled',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestForBusinessUnit: 'TestTeam2',
                approvalRequestCancellationNote: 'Test note'
            },
            deleted: false
        }, {
            uuid: 'test - 3',
            data: {
                approvalRequestStatus: 'approvalRequestResponseReceived',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestDecision: 'approved',
                approvalRequestResponseBy: 'Something',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestResponseNote: 'dcadcadf',
                approvalRequestForBusinessUnit: 'TestTeam3',
                approvalRequestResponseReceivedDate: '2021-08-31'
            },
            deleted: false
        },{
            uuid: 'test - 4',
            data: {
                approvalRequestStatus: 'approvalRequestResponseReceived',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestDecision: 'rejected',
                approvalRequestResponseBy: 'Something',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestResponseNote: 'dcadcadf',
                approvalRequestForBusinessUnit: 'TestTeam4',
                approvalRequestResponseReceivedDate: '2021-08-31'
            },
            deleted: false
        }];

        const PROPS = {
            ...DEFAULT_PROPS,
            somuType,
            somuItems,
            choices: [ {
                'value': 'TestTeam',
                'label': 'Test Team'
            }, {
                'value': 'TestTeam2',
                'label': 'Test Team 2'
            }, {
                'value': 'TestTeam3',
                'label': 'Test Team 3'
            }, {
                'value': 'TestTeam4',
                'label': 'Test Team 4'
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

});
