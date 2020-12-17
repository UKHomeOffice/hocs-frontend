const { dashboardAdapter, userAdapter, teamAdapter, workflowAdapter, stageAdapter } = require('../workstacks');
const { getUtcDateString } = require('../../../libs/dateHelpers');

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

Date.now = jest.fn(() => 1609372800000); // 2020-12-31 00:00:00

const todaysDate = getUtcDateString(new Date(Date.now()));

const mockConfiguration = {
    workstackTypeColumns: [
        { workstackType: 'DEFAULT', workstackColumns: [] },
        { workstackType: 'WCS', workstackColumns: [] }
    ],
    deadlinesEnabled: true
};

const mockLogger = {
    debug: () => {
    },
    info: () => {
    },
    warn: () => {
    },
    error: () => {
    }
};

describe('Dashboard Adapter', () => {
    it('should transform a stage array to a dashboard schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01'
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02'
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03'
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '2200-04-01'
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: todaysDate
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-01'
                }
            ]
        };

        const result = await dashboardAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            configuration: mockConfiguration
        });
        expect(result).toMatchSnapshot();
    });

    it('should transform a stage array to a dashboard schema when deadlines are disabled', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01'
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02'
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03'
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '2200-04-01'
                }
            ]
        };
        const testConfiguration = {
            workstackTypeColumns: [
                { workstackType: 'DEFAULT', workstackColumns: [] },
                { workstackType: 'WCS', workstackColumns: [] }
            ],
            deadlinesEnabled: false
        }
            ;
        const result = await dashboardAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            configuration: testConfiguration
        });
        expect(result).toMatchSnapshot();
    });
});

describe('User Workstack Adapter', () => {
    it('should transform a stage array to a user workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-01',
                    active: true
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-02',
                    active: true
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '2200-01-03',
                    active: false
                }
            ]
        };

        const result = await userAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            configuration: {
                workstackTypeColumns: [
                    { workstackType: 'DEFAULT', workstackColumns: [] },
                    { workstackType: 'WCS', workstackColumns: [] }
                ],
            }
        });
        expect(result).toMatchSnapshot();
    });
});

describe('Team Workstack Adapter', () => {
    it('should transform a stage array to a team workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-04',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-05',
                    caseReference: 'A/1234570/19',
                    active: true,
                    data: {}

                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '06-01-2200',
                    caseReference: 'A/1234569/19',
                    active: false,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {}
                },
            ]
        };

        const result = await teamAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            configuration: {
                workstackTypeColumns: [
                    { workstackType: 'DEFAULT', workstackColumns: [] },
                    { workstackType: 'WCS', workstackColumns: [] }
                ], deadlinesEnabled: true
            }
        });

        expect(result).toMatchSnapshot();
    });

    it('should transform a stage array to a team workstack schema ordered by systemCalculatedPriority', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: { systemCalculatedPriority: 6.05 }
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: { systemCalculatedPriority: 35.0 }
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: { systemCalculatedPriority: 13.43 }
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-04',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: { systemCalculatedPriority: 97.0 }
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-05',
                    caseReference: 'A/1234570/19',
                    active: true,
                    data: { systemCalculatedPriority: 43.9 }

                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '06-01-2200',
                    caseReference: 'A/1234569/19',
                    active: false,
                    data: { systemCalculatedPriority: 56.3 }
                },
            ]
        };

        const result = await teamAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            configuration: {
                workstackTypeColumns: [
                    { workstackType: 'DEFAULT', workstackColumns: [] },
                    { workstackType: 'WCS', workstackColumns: [] }
                ], deadlinesEnabled: true
            }
        })
            ;
        expect(result).toMatchSnapshot();
    });
});

describe('Workflow Workstack Adapter', () => {
    it('should transform a stage array to a workflow workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-04',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-05',
                    caseReference: 'A/1234570/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-06',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'B',
                    userUUID: null,
                    deadline: '1900-01-07',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-08',
                    caseReference: 'A/1234569/19',
                    active: false,
                    data: {}
                }
            ]
        };

        const result = await workflowAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            workflowId: 'WCS',
            configuration: mockConfiguration
        });
        expect(result).toMatchSnapshot();
    });
});

describe('Workflow Workstack Adapter', () => {
    it('should transform a stage array to a workflow workstack schema', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-04',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-05',
                    caseReference: 'A/1234570/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-06',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'B',
                    userUUID: null,
                    deadline: '1900-01-07',
                    caseReference: 'A/1234569/19',
                    active: false,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '2200-01-08',
                    caseReference: 'A/1234569/19',
                    active: true,
                    data: {}
                }
            ]
        };

        const result = await stageAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            workflowId: 'WCS',
            stageId: 'A',
            configuration: mockConfiguration
        });
        expect(result).toMatchSnapshot();
    });
});