import React from 'react';
import WorkstackAllocate from '../workstack.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ApplicationProvider } from '../../../contexts/application';

describe('Workstack component', () => {
    const arraySortSpy = jest.spyOn(Array.prototype, 'sort');

    const MOCK_SUBMIT_HANDLER = jest.fn();
    const MOCK_UPDATE_FORM_DATA = jest.fn();

    beforeEach(() => {
        MOCK_UPDATE_FORM_DATA.mockClear();
        MOCK_SUBMIT_HANDLER.mockClear();
    });

    const PAGE = { params: { caseId: '1234', stageId: '5678' } };
    const BASE_URL = 'http://localhost:8080';
    const MOCK_CONFIG = {
        page: PAGE,
        baseUrl: BASE_URL,
    };

    const DEFAULT_PROPS = {
        items: [
            {
                caseReference: 'case1', caseUUID: 'case_uuid-123', uuid: 'stage_uuid-456', fullName: 'Sam Smith',
                stageTypeDisplay: 'Stage A', assignedUserDisplay: 'User1', assignedTopicDisplay: 'topic1',
                created: '2019-10-29T11:01:32.656563', isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Smith', postcode: 'postcode1' }, nextCaseType: null,
                nextCaseReference: null,
                data: {},
                contributions: 'Cancelled',
                dueContribution: null
            },
            {
                caseReference: 'case2', caseUUID: 'case_uuid-789', uuid: 'stage_uuid-432', fullName: 'John Alex',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User2', assignedTopicDisplay: 'topic2',
                created: '', isActive: 'NO', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Alex', postcode: 'postcode2' }, nextCaseType: null,
                nextCaseReference: null,
                data: {},
                contributions: 'Received',
                dueContribution: null
            },
            {
                caseReference: 'case3', caseUUID: 'case_uuid-abc', uuid: 'stage_uuid-444', fullName: 'Pat Brown',
                stageTypeDisplay: 'Stage C', assignedUserDisplay: 'User3', assignedTopicDisplay: 'topic3',
                created: null, isActive: 'NO', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Ms Brown', postcode: 'postcode3' }, nextCaseType: null,
                nextCaseReference: null,
                data: {}
            },
            {
                caseReference: 'case4', caseUUID: 'case_uuid-efg', uuid: 'stage_uuid-445', fullName: 'Dave Jones',
                stageTypeDisplay: 'Stage D', assignedUserDisplay: 'User4', assignedTeamDisplay: 'team4',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Jones', postcode: 'postcode4' },
                dueContribution: '2020-12-12', nextCaseType: null,
                nextCaseReference: null,
                data: {},
                contributions: 'Overdue'
            },
            {
                caseReference: 'case5', caseUUID: 'case_uuid-hij', uuid: 'stage_uuid-446', fullName: 'Mick Smith',
                stageTypeDisplay: 'Stage E', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team5',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Smith', postcode: '' }, nextCaseType: null,
                nextCaseReference: null,
                data: {}
            },
            {
                caseReference: 'case6', caseUUID: 'case_uuid-klm', uuid: 'stage_uuid-447', fullName: 'Bet Linch',
                stageTypeDisplay: 'Stage F', assignedUserDisplay: 'User6', assignedTeamDisplay: 'team6',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mrs Linch', postcode: null },
                contributions: 'Due',
                dueContribution: '9999-01-01',
                nextCaseType: 'nextCase',
                nextCaseReference: null
            },
            {
                caseReference: 'case7', caseUUID: 'case_uuid-opq', uuid: 'stage_uuid-448', fullName: 'My Name',
                stageTypeDisplay: 'Stage F', assignedUserDisplay: 'User7', assignedTeamDisplay: 'team7',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mrs Linch', postcode: null }
            },
            {
                caseReference: 'case8', caseUUID: 'case_uuid-klm', uuid: 'stage_uuid-449', fullName: 'Correspondent 8',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User8', assignedTeamDisplay: null,
                created: null, isActive: 'YES', stageType: 'FOI_DRAFT',
                data: {
                    DueDate: '2021-01-01',
                    isCaseExtended: 'True'
                },
                nextCaseType: 'nextCase',
                nextCaseReference: 'nextCaseReference'
            },
            {
                caseReference: 'case9', caseUUID: 'case_uuid-nop', uuid: 'stage_uuid-450', fullName: 'Correspondent 9',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User9', assignedTeamDisplay: null,
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                data: {
                    DueDate: '2099-01-01',
                },
                nextCaseType: 'nextCase',
                nextCaseReference: 'nextCaseReference'
            }
        ],
        columns: [
            { displayName: 'Reference', dataAdapter: null, renderer: 'caseLink', dataValueKey: 'caseReference', isFilterable: true },
            { displayName: 'Full Name', dataAdapter: null, renderer: null, dataValueKey: 'fullName', isFilterable: true },
            { displayName: 'Fullname', dataAdapter: 'primaryCorrespondent', renderer: null, dataValueKey: 'fullname', isFilterable: true,sortStrategy: 'correspondentTypeStrategy' },
            { displayName: 'Postcode', dataAdapter: 'primaryCorrespondent', renderer: null, dataValueKey: 'postcode', isFilterable: true,sortStrategy: 'correspondentTypeStrategy' },
            { displayName: 'Current Stage', dataAdapter: null, renderer: null, dataValueKey: 'stageTypeDisplay', isFilterable: true },
            { displayName: 'Owner', dataAdapter: null, renderer: null, dataValueKey: 'assignedUserDisplay', isFilterable: true },
            { displayName: 'Topic', dataAdapter: null, renderer: 'truncateText', dataValueKey: 'assignedTopicDisplay', isFilterable: true },
            { displayName: 'Case Date', dataAdapter: 'localDate', renderer: null, dataValueKey: 'TEST,created', isFilterable: true },
            { displayName: 'Active', dataAdapter: 'indicator', renderer: null, dataValueKey: 'isActive,TEST', isFilterable: true },
            { displayName: 'Contribution Due Date', dataAdapter: null, renderer: 'dueDateWarning', dataValueKey: 'dueContribution', isFilterable: true },
            { displayName: 'Due Date', dataAdapter: 'indicator', renderer: 'dueDateWarning', dataValueKey: 'DueDate', isFilterable: true },
            { displayName: 'Escalate Case', dataAdapter: null, renderer: 'nextCaseType', dataValueKey: 'nextCaseType', isFilterable: false },
            { displayName: 'Hidden Column', dataAdapter: null, renderer: 'hidden', dataValueKey: 'nextCaseReference', isFilterable: false },
            { displayName: 'Extended', dataAdapter: null, renderer: 'extensionIndicator', dataValueKey: 'isCaseExtended', isFilterable: false }
        ],
        selectable: true,
        baseUrl: 'base.url',
        allocateToWorkstackEndpoint: 'api/allocate',
        submitHandler: MOCK_SUBMIT_HANDLER,
        updateFormData: MOCK_UPDATE_FORM_DATA
    };

    const MOVE_TEAM_OPTIONS = {
        moveTeamOptions: [
            { 'label':'TEST TEAM 1','value':'VALUE 1' },
            { 'label':'TEST TEAM 2','value':'VALUE 2' },
            { 'label':'TEST TEAM 3','value':'VALUE 3' },
            { 'label':'TEST TEAM 4','value':'VALUE 4' }
        ]
    };

    test('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate
                        allocateToWorkstackEndpoint={DEFAULT_PROPS.allocateToWorkstackEndpoint}
                        baseUrl={DEFAULT_PROPS.baseUrl}
                        selectable={DEFAULT_PROPS.selectable}
                        submitHandler={DEFAULT_PROPS.submitHandler}
                        updateFormData={DEFAULT_PROPS.updateFormData}
                        items={DEFAULT_PROPS.items}
                    />
                </MemoryRouter>
            </ApplicationProvider>);
        expect(wrapper).toBeDefined();
    });

    it('should render with filtering', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate
                        allocateToWorkstackEndpoint={DEFAULT_PROPS.allocateToWorkstackEndpoint}
                        baseUrl={DEFAULT_PROPS.baseUrl}
                        selectable={DEFAULT_PROPS.selectable}
                        submitHandler={DEFAULT_PROPS.submitHandler}
                        updateFormData={DEFAULT_PROPS.updateFormData}
                        items={DEFAULT_PROPS.items}
                        columns={DEFAULT_PROPS.columns}
                    />
                </MemoryRouter>
            </ApplicationProvider>);

        expect(wrapper).toBeDefined();

        fireEvent.change(wrapper.getByRole('textbox'),  { target: { value: 'sam' } });
        expect(screen.getByText('Sam Smith')).toBeInTheDocument();
    });

    it('should sort when the column heading is clicked', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate
                        allocateToWorkstackEndpoint={DEFAULT_PROPS.allocateToWorkstackEndpoint}
                        baseUrl={DEFAULT_PROPS.baseUrl}
                        selectable={DEFAULT_PROPS.selectable}
                        submitHandler={DEFAULT_PROPS.submitHandler}
                        updateFormData={DEFAULT_PROPS.updateFormData}
                        items={DEFAULT_PROPS.items}
                        columns={DEFAULT_PROPS.columns}
                    />
                </MemoryRouter>
            </ApplicationProvider>);

        arraySortSpy.mockClear();
        expect(wrapper).toBeDefined();
        const referenceLink = wrapper.getByText('Reference');
        fireEvent.click(referenceLink);
        expect(arraySortSpy).toHaveBeenCalledTimes(1);
        expect(wrapper).toMatchSnapshot();
    });

    it('should sort descending when the column heading is clicked twice', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate
                        allocateToWorkstackEndpoint={DEFAULT_PROPS.allocateToWorkstackEndpoint}
                        baseUrl={DEFAULT_PROPS.baseUrl}
                        selectable={DEFAULT_PROPS.selectable}
                        submitHandler={DEFAULT_PROPS.submitHandler}
                        updateFormData={DEFAULT_PROPS.updateFormData}
                        items={DEFAULT_PROPS.items}
                        columns={DEFAULT_PROPS.columns}
                    />
                </MemoryRouter>
            </ApplicationProvider>);
        arraySortSpy.mockClear();
        expect(wrapper).toBeDefined();
        const referenceLink = wrapper.getByText('Reference');
        fireEvent.click(referenceLink);
        fireEvent.click(referenceLink);
        expect(arraySortSpy).toHaveBeenCalledTimes(2);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the move team options', () => {
        const props = Object.assign({}, DEFAULT_PROPS, MOVE_TEAM_OPTIONS);
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate {...props} />
                </MemoryRouter>
            </ApplicationProvider>);

        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should not add link to headers with sortStrategy noSort', () => {
        const propsWithNoSortOnReference = { ...DEFAULT_PROPS, columns: [...DEFAULT_PROPS.columns] };
        propsWithNoSortOnReference.columns[0] =
          { displayName: 'Reference', dataAdapter: null, renderer: 'caseLink', dataValueKey: 'caseReference', isFilterable: true, sortStrategy: 'noSort' };

        const WRAPPER = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <WorkstackAllocate { ...propsWithNoSortOnReference } />
                </MemoryRouter>
            </ApplicationProvider>
        );

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });
});
