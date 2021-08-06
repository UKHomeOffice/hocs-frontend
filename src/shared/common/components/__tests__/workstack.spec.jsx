import React from 'react';
import WrappedWorkstackAllocate from '../workstack.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Workstack component', () => {

    const arraySortSpy = jest.spyOn(Array.prototype, 'sort');

    const MOCK_TRACK = jest.fn();
    const MOCK_SUBMIT_HANDLER = jest.fn();
    const MOCK_UPDATE_FORM_DATA = jest.fn();

    beforeEach(() => {
        arraySortSpy.mockClear();
        MOCK_UPDATE_FORM_DATA.mockClear();
        MOCK_TRACK.mockClear();
        MOCK_SUBMIT_HANDLER.mockClear();
    });

    const DEFAULT_PROPS = {
        track: MOCK_TRACK,
        items: [
            {
                caseReference: 'case1', caseUUID: 'case_uuid-123', uuid: 'stage_uuid-456', fullName: 'Sam Smith',
                stageTypeDisplay: 'Stage A', assignedUserDisplay: 'User1', assignedTopicDisplay: 'topic1',
                created: '2019-10-29T11:01:32.656563', isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Smith', postcode: 'postcode1' }, nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case2', caseUUID: 'case_uuid-789', uuid: 'stage_uuid-432', fullName: 'John Alex',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User2', assignedTopicDisplay: 'topic2',
                created: '', isActive: 'NO', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Alex', postcode: 'postcode2' }, nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case3', caseUUID: 'case_uuid-abc', uuid: 'stage_uuid-444', fullName: 'Pat Brown',
                stageTypeDisplay: 'Stage C', assignedUserDisplay: 'User3', assignedTopicDisplay: 'topic3',
                created: null, isActive: 'NO', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Ms Brown', postcode: 'postcode3' }, nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case4', caseUUID: 'case_uuid-efg', uuid: 'stage_uuid-445', fullName: 'Dave Jones',
                stageTypeDisplay: 'Stage D', assignedUserDisplay: 'User4', assignedTeamDisplay: 'team4',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Jones', postcode: 'postcode4' },
                dueContribution: '2020-12-12', nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case5', caseUUID: 'case_uuid-hij', uuid: 'stage_uuid-446', fullName: 'Mick Smith',
                stageTypeDisplay: 'Stage E', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team5',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mr Smith', postcode: '' }, nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case6', caseUUID: 'case_uuid-klm', uuid: 'stage_uuid-448', fullName: 'My Name',
                stageTypeDisplay: 'Stage F', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team6',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                data: {
                    CaseContributions: '[{"data":{"contributionDueDate":"2020-12-12", "contributionStatus": "TEST"}}]',
                    DueDate: '2021-01-01'
                },
                nextCaseType: null,
                nextCaseReference: null
            },
            {
                caseReference: 'case7', caseUUID: 'case_uuid-klz', uuid: 'stage_uuid-448', fullName: 'Bet Linch',
                stageTypeDisplay: 'Stage F', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team6',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mrs Linch', postcode: null },
                data: {
                    DueDate: '2021-01-01'
                },
                nextCaseType: 'nextCase',
                nextCaseReference: null
            },
            {
                caseReference: 'case8', caseUUID: 'case_uuid-klx', uuid: 'stage_uuid-449', fullName: 'Bet Linch',
                stageTypeDisplay: 'Stage F', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team6',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                primaryCorrespondent: { fullname: 'Mrs Linch', postcode: null },
                data: {
                    DueDate: '2021-01-01'
                },
                nextCaseType: 'nextCase',
                nextCaseReference: 'nextCaseReference'
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
            { displayName: 'Contribution Due Date', dataAdapter: 'indicator', renderer: 'dueDateWarning', dataValueKey: 'dueContribution', isFilterable: true },
            { displayName: 'Due Date', dataAdapter: 'indicator', renderer: 'dueDateWarning', dataValueKey: 'DueDate', isFilterable: true },
            { displayName: 'Escalate Case', dataAdapter: null, renderer: 'nextCaseType', dataValueKey: 'nextCaseType', isFilterable: false },
            { displayName: 'Hidden Column', dataAdapter: null, renderer: 'hidden', dataValueKey: 'nextCaseReference', isFilterable: false }
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

    it('should render with default props', () => {

        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = render(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render with filtering', () => {

        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);


        WRAPPER.find('#workstack-filter').simulate('change', { target: { value: 'sam' } });
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should sort when the column heading is clicked', () => {
        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        const links = WRAPPER.find('th.govuk-link');
        // Column 13 is hidden so isn't counted
        expect(links).toHaveLength(12);
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(27);
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should sort descending when the column heading is clicked twice', () => {
        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        const links = WRAPPER.find('th.govuk-link');
        expect(links).toHaveLength(12);
        links.first().simulate('click');
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(36);
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render the move team options', () => {
        const props =  Object.assign({}, DEFAULT_PROPS, MOVE_TEAM_OPTIONS);
        const OUTER = shallow(<WrappedWorkstackAllocate {...props} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = render(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should call updateFormData with correct values for move team', () => {
        const mockUpdateFormData = jest.fn();
        const props =  Object.assign({}, DEFAULT_PROPS, MOVE_TEAM_OPTIONS, { updateFormData: mockUpdateFormData } );

        const OUTER = shallow(<WrappedWorkstackAllocate {...props} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        WRAPPER.find('option').at(0).simulate('change', {
            target: MOVE_TEAM_OPTIONS.moveTeamOptions[1]
        }); // select TEAM 2

        const moveTeamButton = WRAPPER.find('[name="move_team"]');

        moveTeamButton.first().simulate('click'); // click move team button

        expect(mockUpdateFormData.mock.calls[1][0]).toEqual({ 'selected_team': 'VALUE 2' });
        expect(mockUpdateFormData.mock.calls[2][0]).toEqual({ 'submitAction': 'move_team' });

    });

    it('should not add link to headers with sortStrategy noSort', () => {
        const propsWithNoSortOnReference = { ...DEFAULT_PROPS, columns: [...DEFAULT_PROPS.columns] };
        propsWithNoSortOnReference.columns[0] =
          { displayName: 'Reference', dataAdapter: null, renderer: 'caseLink', dataValueKey: 'caseReference', isFilterable: true, sortStrategy: 'noSort' };

        const OUTER = shallow(<WrappedWorkstackAllocate { ...propsWithNoSortOnReference } />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        const links = WRAPPER.find('th.govuk-link');
        expect(links).toHaveLength(11);

        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });
});
