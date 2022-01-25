const caseViewAllStagesAdapter = require('../case-view-all-stages');

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

    if (list=== 'FOI_APPROVER_ROLES') {
        return 'Dummy Approval Role';
    }

    if (list === 'RANDOM_LIST') {
        return 'Random list value';
    }
});

const mockDataWithSumoApprovals = {
    caseReference: 'FOI/0123456/21',
    schema: {
        title: 'View Case',
        fields: {
            STAGE_NAME: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    }
                }
            ],
            STAGE_NAME_2: [
                {
                    component: 'text',
                    validation: [],
                    props: {
                        name: 'stage_2_field_1',
                        label: 'Stage 2 Field 1'
                    }
                },
                {
                    component: 'somu-list',
                    validation: [
                        'requiredArray',
                        'approvalsFulfilled'
                    ],
                    props: {
                        somuType: {
                            type: 'APPROVAL_REQS',
                            choices: 'FOI_APPROVER_ROLES',
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
                        label: 'Approval Requests',
                        name: 'ApprovalRequests'
                    }
                }
            ]
        }
    },
    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
        ApprovalRequests: '[{"uuid":"0fe92bae-712c-43d3-a76b-f99d4b38993a","data":{"approvalRequestStatus":"approvalRequestResponseReceived","approvalRequestDueDate":"2021-09-01","approvalRequestDecision":"approved","approvalRequestResponseBy":"Mr Tickle","approvalRequestCreatedDate":"2021-08-31","approvalRequestResponseNote":"asdcadsc","approvalRequestForBusinessUnit":"FOI_APPROVER_SPAD_PO","approvalRequestResponseReceivedDate":"2021-08-31"},"deleted":false}]'
    }
};

const mockDataWithSumoMPAMContributions = {
    caseReference: 'MPAM/0123456/21',
    schema: {
        title: 'View Case',
        fields: {
            STAGE_NAME: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    }
                }
            ],
            STAGE_NAME_2: [
                {
                    component: 'text',
                    validation: [],
                    props: {
                        name: 'stage_2_field_1',
                        label: 'Stage 2 Field 1'
                    }
                },
                {
                    component: 'somu-list',
                    validation: [
                        'requiredArray',
                        'contributionsFulfilled'
                    ],
                    props: {
                        somuType: {
                            type: 'CONTRIBUTIONS',
                            choices: 'RANDOM_LIST',
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
                        },
                        label: 'Case contributions',
                        name: 'CaseContributions'
                    }
                }
            ]
        }
    },
    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
        CaseContributions: '[{"data":{"contributionBusinessUnit":"FOI_DIRECTORATE_HOLA_ACCEPTANCE_TEAMS", "contributionBusinessArea": "Business area", "contributionRequestDate":"2021-08-31","contributionDueDate":"2021-09-01","contributionRequestNote":"Eggs please"}}]'
    }
};

const mockDataWithSumoCOMPContributions = {
    caseReference: 'COMP/0123456/21',
    schema: {
        title: 'View Case',
        fields: {
            STAGE_NAME: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    }
                }
            ],
            STAGE_NAME_2: [
                {
                    component: 'text',
                    validation: [],
                    props: {
                        name: 'stage_2_field_1',
                        label: 'Stage 2 Field 1'
                    }
                },
                {
                    component: 'somu-list',
                    validation: [
                        'requiredArray',
                        'contributionsFulfilled'
                    ],
                    props: {
                        somuType: {
                            type: 'CONTRIBUTIONS',
                            choices: 'RANDOM_LIST',
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
                        },
                        label: 'Case contributions',
                        name: 'CaseContributions'
                    }
                }
            ]
        }
    },
    data: {
        my_field: 'Some Value',
        stage_2_field_1: 'Some Label',
        CaseContributions: '[{"data":{"contributionBusinessArea": "Business area", "contributionRequestDate":"2021-08-31","contributionDueDate":"2021-09-01","contributionRequestNote":"Test"}}]'
    }
};

const mockData = {
    caseReference: 'MIN/1234567/18',
    schema: {
        title: 'View Case',
        fields: {
            STAGE_NAME: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    },
                },
                {
                    component: 'date',
                    validation: ['required'],
                    props: {
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                },
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                },
                {
                    component: 'hidden',
                    validation: [],
                    props: {
                        name: 'test_hidden_field',
                        defaultValue: 'TEST'
                    },
                },
            ],
            STAGE_NAME1: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    },
                },
                {
                    component: 'date',
                    validation: ['required'],
                    props: {
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                },
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                },
            ],
            STAGE_NAME2: [
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_field',
                        label: 'My Field'
                    },
                },
                {
                    component: 'date',
                    validation: ['required'],
                    props: {
                        name: 'my_date_field',
                        label: 'My Date Field'
                    },
                },
                {
                    component: 'text',
                    validation: ['required'],
                    props: {
                        name: 'my_empty_field',
                        label: 'My Empty Field'
                    },
                },
            ]

        }
    },
    data: {
        my_field: 'Some Value',
        my_date_field: '2020-01-19',
        test_hidden_field: 'TEST'
    }
};

describe('Case-view-all-stages Adapter', () => {
    it('should build a schema from the provided template and have sections maintain same order as schema object', async () => {

        const result = await caseViewAllStagesAdapter(mockData, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });


    it('should render SOMU Approval case view sections', async () => {

        const result = await caseViewAllStagesAdapter(mockDataWithSumoApprovals, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render SOMU MPAM Contributions case view sections', async () => {

        const result = await caseViewAllStagesAdapter(mockDataWithSumoMPAMContributions, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });

    it('should render SOMU COMP Contributions case view sections', async () => {

        const result = await caseViewAllStagesAdapter(mockDataWithSumoCOMPContributions, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });
});
