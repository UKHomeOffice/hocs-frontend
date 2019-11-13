import React from 'react';
import WrappedWorkstackAllocate from '../workstack.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Workstack component', () => {

    const arraySortSpy = jest.spyOn(Array.prototype, 'sort');

    beforeEach(() => {
        arraySortSpy.mockClear();
    });

    const MOCK_TRACK = jest.fn();
    const MOCK_SUBMIT_HANDLER = jest.fn();
    const MOCK_UPDATE_FORM_DATA = jest.fn();

    const DEFAULT_PROPS = {
        track: MOCK_TRACK,
        items: [
            {
                caseReference: 'case1', caseUUID: 'case_uuid-123', uuid: 'stage_uuid-456', fullName: 'Sam Smith',
                stageTypeDisplay: 'Stage A', assignedUserDisplay: 'User1', assignedTeamDisplay: 'team1',
                created: '2019-10-29T11:01:32.656563', isActive: 'YES'
            },
            {
                caseReference: 'case2', caseUUID: 'case_uuid-789', uuid: 'stage_uuid-432', fullName: 'John Alex',
                stageTypeDisplay: 'Stage B', assignedUserDisplay: 'User2', assignedTeamDisplay: 'team2',
                created: '2018-12-13T11:02:48.546577', isActive: 'NO'
            },
        ],
        columns: [
            { displayName: 'Reference', dataAdapter: null, renderer: 'caseLink', dataValueKey: 'caseReference', isFilterable: true },
            { displayName: 'Full Name', dataAdapter: null, renderer: null, dataValueKey: 'fullName', isFilterable: true },
            { displayName: 'Current Stage', dataAdapter: null, renderer: null, dataValueKey: 'stageTypeDisplay', isFilterable: true },
            { displayName: 'Owner', dataAdapter: null, renderer: null, dataValueKey: 'assignedUserDisplay', isFilterable: true },
            { displayName: 'Team', dataAdapter: null, renderer: null, dataValueKey: 'assignedTeamDisplay', isFilterable: true },
            { displayName: 'Case Date', dataAdapter: 'localDateAdapter', renderer: null, dataValueKey: 'created', isFilterable: true },
            { displayName: 'Active', dataAdapter: 'hideValueNOAdapter', renderer: null, dataValueKey: 'isActive', isFilterable: true }
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
        expect(links).toHaveLength(7);
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(3);
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should sort descending when the column heading is clicked twice', () => {

        const OUTER = shallow(<WrappedWorkstackAllocate {...DEFAULT_PROPS} />);
        const WorkstackAllocate = OUTER.props().children;
        const WRAPPER = mount(<Router><WorkstackAllocate track={MOCK_TRACK} /></Router>);

        const links = WRAPPER.find('th.govuk-link');
        expect(links).toHaveLength(7);
        links.first().simulate('click');
        links.first().simulate('click');
        expect(arraySortSpy).toHaveBeenCalledTimes(4);
        expect(WRAPPER).toMatchSnapshot();
    });
});
