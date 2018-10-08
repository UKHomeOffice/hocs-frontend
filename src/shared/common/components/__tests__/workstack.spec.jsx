import React from 'react';
import Workstack from '../workstack.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../forms/card.jsx', () => () => ('MOCK_CARD'));

describe('Dashboard component', () => {

    const DEFAULT_PROPS = {
        workstack: [
            { caseReference: 'ABC/0000001/AA', caseType: 'ABC', stageTypeDisplay: 'Stage type', assignedUserDisplay: 'User 1', assignedTeamDisplay: 'Team 1', deadline: '2020-01-01', stageUUID: 'STAGE_UUID' },
            { caseReference: 'ABC/0000002/AA', caseType: 'ABC', stageTypeDisplay: 'Stage type', assignedUserDisplay: 'Unassigned', assignedTeamDisplay: 'Team 1', deadline: '2020-01-01', stageUUID: 'STAGE_UUID' }
        ]
    };

    it('should render with default props', () => {
        const WRAPPER = render(
            <MemoryRouter>
                <Workstack {...DEFAULT_PROPS} />
            </MemoryRouter >
        );
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should filter cases based on caseReference', () => {
        const PROPS = {
            workstack: [
                { caseReference: 'ABC/0000002/AA', caseType: 'ABC', stageTypeDisplay: 'Stage type', assignedUserDisplay: 'User 1', assignedTeamDisplay: 'Team 1', deadline: '2020-01-01', stageUUID: 'STAGE_UUID' },
                { caseReference: 'ABC/0000001/AA', caseType: 'ABC', stageTypeDisplay: 'Stage type', assignedUserDisplay: 'Unassigned', assignedTeamDisplay: 'Team 1', deadline: '2020-01-01', stageUUID: 'STAGE_UUID' }
            ]
        };
        const WRAPPER = shallow(
            <MemoryRouter>
                <Workstack {...PROPS} />
            </MemoryRouter >
        );
        expect(WRAPPER).toBeDefined();
    });

});