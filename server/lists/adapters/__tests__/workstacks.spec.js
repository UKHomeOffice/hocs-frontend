const { dashboardAdapter, userAdapter, teamAdapter, workflowAdapter, stageAdapter } = require('../workstacks');

const mockUser = { uuid: 1 };
const mockFromStaticList = jest.fn((list) => {
    switch (list) {
        case 'S_TEAMS':
            return 'MOCK_TEAM';
        case 'S_CASETYPES':
            return 'MOCK_CASETYPE';
        case 'S_STAGETYPES':
            return 'MOCK_STAGETYPE';
        case 'S_USERS':
            return 'MOCK_USER';
        default:
            return null;
    }
});

describe('Dashboard Adapter', () => {
    it('should transform a stage array to a dashboard schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-1900'
                },
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900'
                },
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '01-01-2200'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-2200'
                }
            ]
        };

        const result = await dashboardAdapter(mockData, { user: mockUser, fromStaticList: mockFromStaticList });
        expect(result).toMatchSnapshot();
    });
});

describe('User Workstack Adapter', () => {
    it('should transform a stage array to a user workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '01-01-2200'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-2200'
                }
            ]
        };

        const result = await userAdapter(mockData, { user: mockUser, fromStaticList: mockFromStaticList });
        expect(result).toMatchSnapshot();
    });
});

describe('Team Workstack Adapter', () => {
    it('should transform a stage array to a team workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234567/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'C',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234570/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234569/19'
                },
            ]
        };

        const result = await teamAdapter(mockData, { user: mockUser, fromStaticList: mockFromStaticList, teamId: 2 });
        expect(result).toMatchSnapshot();
    });
});

describe('Workflow Workstack Adapter', () => {
    it('should transform a stage array to a workflow workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234567/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'C',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234570/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'B',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'C',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234569/19'
                }
            ]
        };

        const result = await workflowAdapter(mockData, { user: mockUser, fromStaticList: mockFromStaticList, teamId: 2, workflowId: 'B' });
        expect(result).toMatchSnapshot();
    });
});

describe('Workflow Workstack Adapter', () => {
    it('should transform a stage array to a workflow workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'A',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234567/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'C',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234568/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234570/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'B',
                    stageType: 'B',
                    userUUID: null,
                    deadline: '01-01-1900',
                    caseReference: 'A/1234569/19'
                },
                {
                    teamUUID: 2,
                    caseType: 'C',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '01-01-2200',
                    caseReference: 'A/1234569/19'
                }
            ]
        };

        const result = await stageAdapter(mockData, { user: mockUser, fromStaticList: mockFromStaticList, teamId: 2, workflowId: 'B', stageId: 'A' });
        expect(result).toMatchSnapshot();
    });
});