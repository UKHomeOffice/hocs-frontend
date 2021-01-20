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
                data: {}
            },
            {
                caseReference: 'case2', caseUUID: 'case_uuid-789', uuid: 'stage_uuid-432', fullName: 'John Alex',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User2', assignedTopicDisplay: 'topic2',
                created: '', isActive: 'NO', stageType: 'MPAM_DRAFT',
                data: {}
            },
            {
                caseReference: 'case3', caseUUID: 'case_uuid-abc', uuid: 'stage_uuid-444', fullName: 'Pat Brown',
                stageTypeDisplay: 'Stage C', assignedUserDisplay: 'User3', assignedTopicDisplay: 'topic3',
                created: null, isActive: 'NO', stageType: 'MPAM_DRAFT',
                data: {}
            },
            {
                caseReference: 'case4', caseUUID: 'case_uuid-efg', uuid: 'stage_uuid-445', fullName: 'Dave Jones',
                stageTypeDisplay: 'Stage D', assignedUserDisplay: 'User4', assignedTeamDisplay: 'team4',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                data: { CaseContributions: '[{"data":{"contributionDueDate":"2020-12-12"}}]' }
            },
            {
                caseReference: 'case5', caseUUID: 'case_uuid-hij', uuid: 'stage_uuid-446', fullName: 'Mick Smith',
                stageTypeDisplay: 'Stage E', assignedUserDisplay: 'User5', assignedTeamDisplay: 'team5',
                created: null, isActive: 'YES', stageType: 'MPAM_DRAFT',
                data: { CaseContributions: '[{}]' }
            },
        ],
        columns: [
            { displayName: 'Reference', dataAdapter: null, renderer: 'caseLink', dataValueKey: 'caseReference', isFilterable: true },
            { displayName: 'Full Name', dataAdapter: null, renderer: null, dataValueKey: 'fullName', isFilterable: true },
            { displayName: 'Current Stage', dataAdapter: null, renderer: null, dataValueKey: 'stageTypeDisplay', isFilterable: true },
            { displayName: 'Owner', dataAdapter: null, renderer: null, dataValueKey: 'assignedUserDisplay', isFilterable: true },
            { displayName: 'Topic', dataAdapter: null, renderer: 'truncateText', dataValueKey: 'assignedTopicDisplay', isFilterable: true },
            { displayName: 'Case Date', dataAdapter: 'localDate', renderer: null, dataValueKey: 'TEST,created', isFilterable: true },
            { displayName: 'Active', dataAdapter: 'indicator', renderer: null, dataValueKey: 'isActive,TEST', isFilterable: true },
            { displayName: 'Due Date', dataAdapter: 'indicator', renderer: 'dueDateWarning', dataValueKey: 'data.CaseContributions', isFilterable: true }

        ],
        selectable: true,
        baseUrl: 'base.url',
        allocateToWorkstackEndpoint: 'api/allocate',
        submitHandler: MOCK_SUBMIT_HANDLER,
        updateFormData: MOCK_UPDATE_FORM_DATA
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
        expect(links).toHaveLength(8);
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(9);
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should sort descending when the column heading is clicked twice', () => {

        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        const links = WRAPPER.find('th.govuk-link');
        expect(links).toHaveLength(8);
        links.first().simulate('click');
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(12);
        expect(WRAPPER).toMatchSnapshot();
    });
});
