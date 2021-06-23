const {
    dashboardAdapter,
    userAdapter,
    teamAdapter,
    workflowAdapter,
    stageAdapter,
    byTag
} = require('../workstacks');
const { getUtcDateString } = require('../../../libs/dateHelpers');

const mockUser = { uuid: 1 };

const mockTopic = 'MOCK_TOPIC';

const mockFromStaticList = jest.fn((list) => {
    switch (list) {
        case 'S_ALL_TEAMS':
            return 'MOCK_TEAM';
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
                    teamUuid: 1,
                    statistics: {
                        usersCases: 0,
                        usersOverdueCases: 0,
                        cases: 0,
                        overdueCases: 0,
                        unallocatedCases: 0
                    }
                },
                {
                    teamUuid: 2,
                    statistics: {
                        usersCases: 1,
                        usersOverdueCases: 1,
                        cases: 2,
                        overdueCases: 1,
                        unallocatedCases: 1
                    }
                },
                {
                    teamUuid: 3,
                    statistics: {
                        usersCases: 0,
                        usersOverdueCases: 0,
                        cases: 0,
                        overdueCases: 0,
                        unallocatedCases: 0
                    }
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
                    teamUuid: 1,
                    statistics: {
                        usersCases: 0,
                        usersOverdueCases: 0,
                        cases: 0,
                        overdueCases: 0,
                        unallocatedCases: 0
                    }
                },
                {
                    teamUuid: 2,
                    statistics: {
                        usersCases: 1,
                        usersOverdueCases: 1,
                        cases: 2,
                        overdueCases: 1,
                        unallocatedCases: 1
                    }
                },
                {
                    teamUuid: 3,
                    statistics: {
                        usersCases: 0,
                        usersOverdueCases: 0,
                        cases: 0,
                        overdueCases: 0,
                        unallocatedCases: 0
                    }
                }
            ]
        };
        const testConfiguration = {
            ...mockConfiguration,
            deadlinesEnabled: false
        };

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
                    active: true,
                    assignedTopic: mockTopic,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-02',
                    active: true,
                    data: {}
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '2200-01-03',
                    active: false,
                    data: {}
                }
            ]
        };

        const result = await userAdapter(mockData, {
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    correspondents: {
                        correspondents: [ { fullname: 'testNameFOIRequester', uuid: 'uuid123', is_primary: 'true' } ]
                    },
                    teamUUID: 2,
                    caseType: 'FOI',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-02-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {
                        CaseContributions: '[{}]',
                    }
                }
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
    it('should hide unworkable', async () => {
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
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
                    data: {
                        Unworkable: 'True'
                    }
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
                    data: {
                        Unworkable: 'True'
                    },
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {},
                    assignedTopic: mockTopic
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
                    data: { systemCalculatedPriority: 6.05 },
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: { systemCalculatedPriority: 35.0 },
                    assignedTopic: mockTopic
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    data: {},
                    assignedTopic: mockTopic
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
                    data: {},
                    assignedTopic: mockTopic
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
    it('should hide unworkable', async () => {
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: todaysDate,
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 1,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: 1,
                    deadline: '1900-01-01',
                    caseReference: 'A/1234567/19',
                    active: false,
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {
                        Unworkable: 'True'
                    }
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
                    data: {},
                    assignedTopic: mockTopic
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
                    data: {},
                    assignedTopic: mockTopic
                },
                {
                    teamUUID: 2,
                    caseType: 'DEFAULT',
                    stageType: 'A',
                    userUUID: null,
                    deadline: '1900-01-02',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {},
                    assignedTopic: mockTopic
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
                    data: {},
                    assignedTopic: mockTopic
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

    it('should transform a stage array to a workflow workstack with a contributionDueDate',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'A',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true,
                        dueContribution: '2020-12-12'
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

    it('should transform a stage array to a workflow workstack with no contributeDueDate but stage type matching contributionReceivedStages', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'MPAM_TRIAGE',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true
                }
            ]
        };

        const result = await stageAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            workflowId: 'WCS',
            stageId: 'MPAM_TRIAGE',
            configuration: mockConfiguration
        });
        expect(result).toMatchSnapshot();
    });

    it('should transform a stage array to a workflow workstack with no contributeDueDate and stage type not matching contributionReceivedStages', async () => {
        const mockData = {
            stages: [
                {
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true
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

    it('should add the case ref and primary correspondent to primaryCorrespondentAndRefDisplay', async () => {
        const mockData = {
            stages: [
                {
                    correspondents: {
                        correspondents: [{ fullname: 'testName', uuid: 'uuid123', is_primary: 'true' }]
                    },
                    teamUUID: 2,
                    caseType: 'WCS',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true
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

    it('should add the fullname and postcode of primaryCorrespondent to primaryCorrespondent', async () => {
        const mockData = {
            stages: [
                {
                    correspondents: {
                        correspondents: [
                            { fullname: 'testName', postcode: 'postcode1', uuid: 'uuid123', is_primary: 'false' },
                            { fullname: 'primaryC', postcode: 'postcode2', uuid: 'uuid456', is_primary: 'true' }
                        ]
                    },
                    teamUUID: 2,
                    caseType: 'COMP',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'COMP/1234568/19',
                    active: true,
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

    it('should add the primary correspondent to FOIRequester field for FOI case type', async () => {
        const mockData = {
            stages: [
                {
                    correspondents: {
                        correspondents: [ { fullname: 'testNameFOIRequester', uuid: 'uuid123', is_primary: 'true' } ]
                    },
                    teamUUID: 2,
                    caseType: 'FOI',
                    stageType: 'A',
                    userUUID: 2,
                    deadline: '2200-01-03',
                    caseReference: 'A/1234568/19',
                    active: true,
                    data: {
                        CaseContributions: '[{}]',
                    }
                }
            ]
        };

        const result = await stageAdapter(mockData, {
            user: mockUser,
            fromStaticList: mockFromStaticList,
            logger: mockLogger,
            teamId: 2,
            workflowId: 'COMP',
            stageId: 'A',
            configuration: mockConfiguration
        });
        expect(result).toMatchSnapshot();
    });

    it('should transform a stage array to a workflow workstack with at MPAM_TRIAGE with contributionStatus',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'MPAM_TRIAGE',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true
                    }
                ]
            };

            const result = await stageAdapter(mockData, {
                user: mockUser,
                fromStaticList: mockFromStaticList,
                logger: mockLogger,
                teamId: 2,
                workflowId: 'WCS',
                stageId: 'MPAM_TRIAGE',
                configuration: mockConfiguration
            });

            expect(result).toMatchSnapshot();
        });

    it('should transform a stage array to a workflow workstack with at MPAM_TRIAGE_REQUESTED_CONTRIBUTION with contributionDueDate',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true,
                        dueContribution: '2020-12-12'
                    }
                ]
            };

            const result = await stageAdapter(mockData, {
                user: mockUser,
                fromStaticList: mockFromStaticList,
                logger: mockLogger,
                teamId: 2,
                workflowId: 'WCS',
                stageId: 'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
                configuration: mockConfiguration
            });

            expect(result).toMatchSnapshot();
        });

    it('should transform a stage array to a workflow workstack with at MPAM_TRIAGE_REQUESTED_CONTRIBUTION with contributionStatus and contributionStatus',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true
                    }
                ]
            };

            const result = await stageAdapter(mockData, {
                user: mockUser,
                fromStaticList: mockFromStaticList,
                logger: mockLogger,
                teamId: 2,
                workflowId: 'WCS',
                stageId: 'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
                configuration: mockConfiguration
            });

            expect(result).toMatchSnapshot();
        });

    it('should transform a stage array to a workflow workstack with at MPAM_DRAFT_REQUESTED_CONTRIBUTION with contributionStatus',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true,
                        dueContribution: '2020-12-12'
                    }
                ]
            };

            const result = await stageAdapter(mockData, {
                user: mockUser,
                fromStaticList: mockFromStaticList,
                logger: mockLogger,
                teamId: 2,
                workflowId: 'WCS',
                stageId: 'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
                configuration: mockConfiguration
            });

            expect(result).toMatchSnapshot();
        });

    it('should transform a stage array to a workflow workstack with at MPAM_DRAFT_REQUESTED_CONTRIBUTION with contributionStatus and contributionStatus',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true
                    }
                ]
            };

            const result = await stageAdapter(mockData, {
                user: mockUser,
                fromStaticList: mockFromStaticList,
                logger: mockLogger,
                teamId: 2,
                workflowId: 'WCS',
                stageId: 'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
                configuration: mockConfiguration
            });

            expect(result).toMatchSnapshot();
        });

    it('should transform a stage array to a workflow workstack with DueDate with contributionDueDate',
        async () => {
            const mockData = {
                stages: [
                    {
                        teamUUID: 2,
                        caseType: 'WCS',
                        stageType: 'A',
                        userUUID: 2,
                        deadline: '2200-01-03',
                        caseReference: 'A/1234568/19',
                        active: true,
                        dueContribution: '2020-12-12',
                        data: {
                            DueDate: '2020-12-10'
                        }
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

    describe('Sort cases by tags', () => {
        it('Should return -1 if case a has tags and case b has no tags', () => {
            const a = {
                tag: ['HS']
            };

            const b = {
                tag:[]
            };

            const result = byTag(a, b);
            expect(result).toEqual(-1);
        });

        it('Should return 1 if case a has no tags and case b has tags', () => {
            const a = {
                tag: []
            };

            const b = {
                tag:['HS']
            };

            const result = byTag(a, b);
            expect(result).toEqual(1);
        });

        it('Should return 1 if case a has tags and case b has tags', () => {
            const a = {
                tag: ['HS']
            };

            const b = {
                tag:['HS']
            };

            const result = byTag(a, b);
            expect(result).toEqual(0);
        });
    });

});
