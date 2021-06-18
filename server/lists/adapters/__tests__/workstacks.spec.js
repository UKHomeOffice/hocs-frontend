const { dashboardAdapter, userAdapter, teamAdapter, workflowAdapter, stageAdapter, getContributionStrings, getHighestPriorityContribution } = require('../workstacks');
const { getUtcDateString } = require('../../../libs/dateHelpers');

const mockUser = { uuid: 1 };

const mockTopic = 'MOCK_TOPIC';

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
                    active: true,
                    assignedTopic: mockTopic
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
                        data: {
                            CaseContributions: '[{"contributionDueDate":"2020-12-12"}]'
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
                    active: true,
                    data: {
                        CaseContributions: '[{}]'
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
                    active: true,
                    data: {
                        CaseContributions: '[{}]'
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

    it('should add the case ref and primary correspondent to primaryCorrespondentAndRefDisplay', async () => {
        const mockData = {
            stages: [
                {
                    correspondents: {
                        correspondents: [ { fullname: 'testName', uuid: 'uuid123', is_primary: 'true' } ]
                    },
                    teamUUID: 2,
                    caseType: 'WCS',
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
                        active: true,
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12", "contributionStatus":"blah"}}]'
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
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12"}}]'
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
                        active: true,
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12", "contributionStatus": "TEST"}}]'
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
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12"}}]'
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
                        active: true,
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12", "contributionStatus": "TEST"}}]'
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
                        data: {
                            CaseContributions: '[{"data": {"contributionDueDate":"2020-12-12"}}]',
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

});

describe('getContributionString', () => {
    it('should convert contribution objects into a list of single word summaries', () => {
        const currentDate = new Date('2021-06-18 12:30');
        const contributions = '[{"data":{"contributionRequestDate":"2021-06-18","contributionDueDate":"2021-06-02","contributionStatus":"contributionReceived"}},' +
            '{"data":{"contributionDueDate":"2021-06-20","contributionRequestDate":"2021-06-18"}},' +
            '{"data":{"contributionDueDate":"2021-06-02","contributionRequestDate":"2021-06-18"}},' +
            '{"data":{"contributionDueDate":"2021-06-02","contributionRequestDate":"2021-06-18","contributionStatus":"contributionCancelled"}}]';

        const returnedStrings = getContributionStrings(contributions, currentDate);

        expect(returnedStrings[0]).toEqual('Complete');
        expect(returnedStrings[1]).toEqual('Due');
        expect(returnedStrings[2]).toEqual('Overdue');
        expect(returnedStrings[3]).toEqual('Cancelled');
    });
});

describe('orderContributionPriority', () => {
    it('should convert take a list of contribution status and return the most important', () => {
        var list = ['Complete', 'Cancelled', 'Overdue', 'Due'];
        expect(getHighestPriorityContribution(list)).toEqual('Overdue');

        list = ['Complete', 'Cancelled', 'Due'];
        expect(getHighestPriorityContribution(list)).toEqual('Due');

        list = ['Complete', 'Cancelled'];
        expect(getHighestPriorityContribution(list)).toEqual('Cancelled');

        list = ['Complete'];
        expect(getHighestPriorityContribution(list)).toEqual('Complete');
    });
});