// Inverse default
jest.mock('../../../config/unallocated/config.json', () => ({
    TEST1: {
        displayAsFields: true,
        displayAll: true,
        displayHeading: false
    }
}), { virtual: true });

const caseViewUnallocatedAdapter = require('../case-view-unallocated');

const sumoTypes = {
    FOI: {
        APPROVAL_REQS: {
            uuid: '338a9573-2232-4370-8d54-fc98bfe9759b',
            caseType: 'FOI',
            type: 'APPROVAL_REQS',
            active: true,
            schema: {
                fields: [
                    {
                        name: 'approvalRequestForBusinessUnit',
                        label: 'Approver Role'
                    },
                    {
                        name: 'approvalRequestCreatedDate',
                        label: 'Approval request date'
                    },
                    {
                        name: 'approvalRequestDueDate',
                        label: 'Response due date'
                    },
                    {
                        name: 'approvalRequestStatus',
                        label: 'Approval request status'
                    },
                    {
                        name: 'approvalRequestResponseReceivedDate',
                        label: 'Date response received'
                    },
                    {
                        name: 'approvalRequestDecision',
                        label: 'Decision'
                    },
                    {
                        name: 'approvalRequestResponseBy',
                        label: 'Respondents name'
                    },
                    {
                        name: 'approvalRequestResponseNote',
                        label: 'Details'
                    },
                    {
                        name: 'approvalRequestCancellationNote',
                        label: 'Reason for cancelling'
                    }
                ],
                renderers: {
                    table: 'ApprovalRequestTable',
                    unallocated: 'ApprovalRequests'
                }
            }
        },
        CONTRIBUTIONS: {
            uuid: '7bf1e9e0-5afd-48a7-9c75-5486ff859b4d',
            caseType: 'FOI',
            type: 'CONTRIBUTIONS',
            active: true,
            schema: {
                fields: [
                    {
                        name: 'contributionBusinessArea',
                        label: 'Contribution Business Area'
                    },
                    {
                        name: 'contributionBusinessUnit',
                        label: 'Contribution Business Unit'
                    },
                    {
                        name: 'contributionRequestDate',
                        label: 'Contribution Date requested'
                    },
                    {
                        name: 'contributionDueDate',
                        label: 'Contribution Due Date'
                    },
                    {
                        name: 'contributionRequestNote',
                        label: 'Contribution Request Notes'
                    },
                    {
                        name: 'contributionStatus',
                        label: 'Contribution Status'
                    },
                    {
                        name: 'contributionReceivedDate',
                        label: 'Contribution Received Date'
                    },
                    {
                        name: 'contributionReceivedNote',
                        label: 'Contribution Received Notes'
                    },
                    {
                        name: 'contributionCancellationNote',
                        label: 'Contribution Cancellation Note'
                    }
                ],
                renderers: {
                    table: 'FoiTable',
                    unallocated: 'MultipleContributions'
                }
            }
        }
    },
    MPAM: {
        CONTRIBUTIONS: {
            uuid: '04696105-1e1f-4e5e-9fd2-6721cad43289',
            caseType: 'MPAM',
            type: 'CONTRIBUTIONS',
            active: true,
            schema: {
                fields: [
                    {
                        name: 'contributionBusinessArea',
                        label: 'Contribution Business Area'
                    },
                    {
                        name: 'contributionBusinessUnit',
                        label: 'Contribution Business Unit'
                    },
                    {
                        name: 'contributionRequestDate',
                        label: 'Contribution Date requested'
                    },
                    {
                        name: 'contributionDueDate',
                        label: 'Contribution Due Date'
                    },
                    {
                        name: 'contributionRequestNote',
                        label: 'Contribution Request Notes'
                    },
                    {
                        name: 'contributionStatus',
                        label: 'Contribution Status'
                    },
                    {
                        name: 'contributionReceivedDate',
                        label: 'Contribution Received Date'
                    },
                    {
                        name: 'contributionReceivedNote',
                        label: 'Contribution Received Notes'
                    },
                    {
                        name: 'contributionCancellationNote',
                        label: 'Contribution Cancellation Note'
                    }
                ],
                renderers: {
                    table: 'MpamTable',
                    unallocated: 'MultipleContributions'
                }
            }
        }
    }
};

const mockFromStaticList = jest.fn((list, requiredData) => {
    if (list === 'S_STAGETYPES') {
        return requiredData;
    }

    if (list === 'SOMU_TYPES') {
        return sumoTypes[requiredData[0]][requiredData[1]];
    }
});

const mockFetchList = jest.fn((list, requiredData) => {
    if (list === 'FOI_APPROVER_ROLES') {
        return [
            {
                value: 'TestUnit',
                label: 'Dummy Approval Role'
            }
        ];
    }

    if (list === 'RANDOM_LIST') {
        return [
            {
                value: 'TestArea',
                label: 'Dummy Test Area'
            },
            {
                value: 'TestUnit',
                label: 'Dummy Test Unit'
            }
        ];
    }

    if (list === 'CASE_SOMU_ITEM') {
        if (requiredData['somuTypeId'] === '338a9573-2232-4370-8d54-fc98bfe9759b') { // APPROVAL_REQS
            return [
                {
                    data: {
                        approvalRequestStatus: 'approvalRequestResponseReceived',
                        approvalRequestDueDate: '2020-01-01',
                        approvalRequestForBusinessUnit: 'TestUnit',
                        approvalRequestDecision: 'approved'
                    }
                }
            ];
        } else {
            return [
                {
                    data: {
                        contributionDueDate: '2021-09-01',
                        contributionBusinessUnit: 'TestUnit',
                        contributionBusinessArea: 'TestArea'
                    }
                }
            ];
        }
    }
});

const mockDataWithSumoApprovals = {
    type: 'TEST',
    caseReference: 'TEST/0123456/21',
    fields: {
        'Test Stage 1': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'
            }
        ],
        'Test Stage 2': [
            {
                component: 'text',
                name: 'stage_2_field_1',
                label: 'Stage 2 Field 1'
            },
            {
                component: 'somu-list',
                props: {
                    choices: {
                        approvalRequestForBusinessUnit: 'FOI_APPROVER_ROLES'
                    },
                    somuType: {
                        type: 'APPROVAL_REQS',
                        caseType: 'FOI'
                    },
                    itemLinks: [
                        {
                            'label': 'Edit',
                            'action': 'edit'
                        }
                    ],
                    primaryLink: {
                        label: 'Add an Approval Request',
                        action: 'addRequest'
                    },
                },
                label: 'Approval Requests',
                name: 'ApprovalRequests'
            }
        ]
    },
    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
    }
};

const mockDataWithSumoMPAMContributions = {
    type: 'TEST',
    caseReference: 'TEST/0123456/21',
    fields: {
        'Test Stage 1': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'
            }
        ],
        'Test Stage 2': [
            {
                component: 'text',
                name: 'stage_2_field_1',
                label: 'Stage 2 Field 1'
            },
            {
                component: 'somu-list',
                props: {
                    choices: {
                        contributionBusinessArea: 'RANDOM_LIST',
                        contributionBusinessUnit: 'RANDOM_LIST'
                    },
                    somuType: {
                        type: 'CONTRIBUTIONS',
                        caseType: 'MPAM'
                    },
                    itemLinks: [
                        {
                            'label': 'Edit',
                            'action': 'edit'
                        }
                    ],
                    primaryLink: {
                        label: 'Add a Contribution',
                        action: 'addRequest'
                    }
                },
                label: 'Case contributions',
                name: 'CaseContributions'
            }
        ]
    },

    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
    }
};

const mockDataWithSumoCOMPContributions = {
    type: 'TEST',
    caseReference: 'TEST/0123456/21',

    fields: {
        'Test Stage 1': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'

            }
        ],
        'Test Stage 2': [
            {
                component: 'text',
                name: 'stage_2_field_1',
                label: 'Stage 2 Field 1'
            },
            {
                component: 'somu-list',
                props: {
                    choices: {
                        contributionBusinessArea: 'RANDOM_LIST',
                        contributionBusinessUnit: 'RANDOM_LIST'
                    },
                    somuType: {
                        type: 'CONTRIBUTIONS',
                        caseType: 'MPAM'
                    },
                    itemLinks: [
                        {
                            'label': 'Edit',
                            'action': 'edit'
                        }
                    ],
                    primaryLink: {
                        label: 'Add a Contribution',
                        action: 'addRequest'
                    }
                },
                label: 'Case contributions',
                name: 'CaseContributions'
            }
        ]
    },

    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
    }
};

const mockData = {
    type: 'TEST',
    caseReference: 'TEST/1234567/18',
    fields: {
        'Test Stage 1': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'
            },
            {
                component: 'date',
                name: 'my_date_field',
                label: 'My Date Field'
            },
            {
                component: 'text',
                name: 'my_empty_field',
                label: 'My Empty Field'
            }
        ],
        'Test Stage 2': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'
            },
            {
                component: 'date',
                name: 'my_date_field',
                label: 'My Date Field'
            },
            {
                component: 'text',
                name: 'my_empty_field',
                label: 'My Empty Field'
            },
        ],
        'Test Stage 3': [
            {
                component: 'text',
                name: 'my_field',
                label: 'My Field'
            },
            {
                component: 'date',
                name: 'my_date_field',
                label: 'My Date Field'
            },
            {
                component: 'text',
                name: 'my_empty_field',
                label: 'My Empty Field'
            },
            {
                component: 'checkbox',
                name: 'my_empty_field',
                label: 'My Empty Field'
            },
        ]
    },
    data: {
        my_field: 'Some Value',
        my_date_field: '2020-01-19',
        test_hidden_field: 'TEST'
    }
};

describe('Unallocated case view adapter', () => {
    it('should build a schema from the provided template and have sections maintain same order as schema object', async () => {

        const result = await caseViewUnallocatedAdapter(mockData, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render SOMU Approval case view sections', async () => {

        const result = await caseViewUnallocatedAdapter(mockDataWithSumoApprovals, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render SOMU MPAM Contributions case view sections', async () => {

        const result = await caseViewUnallocatedAdapter(mockDataWithSumoMPAMContributions, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render SOMU COMP Contributions case view sections', async () => {

        const result = await caseViewUnallocatedAdapter(mockDataWithSumoCOMPContributions, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render checkboxes with custom label', async () => {
        const mockData = {
            type: 'TEST',
            caseReference: 'TEST/1234567/18',
            fields: {
                'Test Stage 1': [
                    {
                        component: 'checkbox',
                        validation: ['required'],
                        props: {
                            choices: [
                                { 'label': 'Test', 'value': 'Test' }
                            ]
                        }, name: 'checkbox_field_1',
                        label: 'Checkbox Field 1',
                    },
                    {
                        component: 'checkbox',
                        validation: ['required'],
                        props: {
                            choices: [
                                { 'label': 'Test', 'value': 'Test' }
                            ],
                            showLabel: true
                        },
                        name: 'checkbox_field_2',
                        label: 'Checkbox Field 1',
                    }
                ]
            },
            data: {
                checkbox_field_1: 'Test',
                checkbox_field_2: 'Test',
            }
        };


        const result = await caseViewUnallocatedAdapter(mockData, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render with inverse default config', async () => {
        const mockData = {
            type: 'TEST1',
            caseReference: 'TEST1/1234567/18',
            fields: {
                'Test Stage 1': [
                    {
                        component: 'text',
                        name: 'my_field',
                        label: 'My Field'
                    },
                    {
                        component: 'date',
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                    {
                        component: 'text',
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    }
                ],
                'Test Stage 2': [
                    {
                        component: 'text',
                        name: 'my_field',
                        label: 'My Field'
                    },
                    {
                        component: 'date',
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                    {
                        component: 'text',
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                ],
                'Test Stage 3': [
                    {
                        component: 'text',
                        name: 'my_field',
                        label: 'My Field'
                    },
                    {
                        component: 'date',
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                    {
                        component: 'text',
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                    {
                        component: 'checkbox',
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                ]
            },
            data: {
                my_field: 'Some Value',
                my_date_field: '2020-01-19',
                test_hidden_field: 'TEST'
            }
        };

        const result = await caseViewUnallocatedAdapter(mockData, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render checkbox groups with separate values', async () => {
        const data = {
            type: 'TEST',
            caseReference: 'TEST/1234567/18',
            fields: {
                'Test Stage 1': [
                    {
                        props: {
                            choices: [
                                {
                                    name: 'nameA',
                                    value: 'valueA',
                                    label: 'label A'
                                },
                                {
                                    name: 'nameB',
                                    value: 'valueB',
                                    label: 'label B'
                                }
                            ]
                        },
                        component: 'checkbox-group',
                        name: 'checkbox_group',
                        label: 'Checkbox Group'
                    },
                ],
            },
            data: {
                nameA: 'valueA',
                nameB: 'valueB'
            }
        };

        const result = await caseViewUnallocatedAdapter(data, {
            fromStaticList: mockFromStaticList,
            fetchList: mockFetchList
        });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });
});
