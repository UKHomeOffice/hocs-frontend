const caseSummaryAdapter = require('../case-summary');
jest.mock('../../../clients', () => ({
    caseworkService: {
        get: jest.fn()
    }
}));
const { caseworkService } = require('../../../clients');

const choiceOptionsTopics = [
    {
        label: 'Parent B',
        options: [
            {
                label: 'X Mock Label 1',
                value: 'mock-value-1',
                active: true
            },
            {
                label: 'A Mock Label 2',
                value: 'mock-value-2',
                active: true
            }
        ]
    }, {
        label: 'Parent A',
        options: [
            {
                label: 'C Mock Label 3',
                value: 'mock-value-3',
                active: false
            },
            {
                label: 'B Mock Label 4',
                value: 'mock-value-4',
                active: true
            }
        ]
    }
];

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
        case 'TOPIC':
            return choiceOptionsTopics;
        default:
            return null;
    }
});

const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };

const mockFetchList = jest.fn((list) => {
    switch (list) {
        case 'S_LIST_TEST_VALUES':
            return [{ value: 'TESTA', label: 'TestA text' }, { value: 'TESTB', label: 'TestB text' }];
        default:
            return null;
    }
});

describe('Case Summary Adapter', () => {

    it('should transform minimal case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: null,
            primaryTopic: null,
            primaryCorrespondent: null,
            stageDeadlines: [],
            activeStages: [],
            deadLineExtensions: [],
            somuItems: [],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should transform somuItems in case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: null,
            primaryTopic: null,
            primaryCorrespondent: null,
            stageDeadlines: [],
            activeStages: [],
            deadLineExtensions: [],
            somuItems: [
                {
                    schema: {
                        fields: [
                            {
                                name: 'listServiceField',
                                choices: 'S_LIST_TEST_VALUES',
                            },
                            {
                                name: 'choiceMapField',
                                choices: [
                                    {
                                        label: 'Yes',
                                        value: 'y'
                                    },
                                    {
                                        label: 'No',
                                        value: 'n'
                                    }
                                ],
                                summaryLabel: 'Complete',
                            },
                            {
                                name: 'dateField',
                                type: 'date',
                                summaryLabel: 'Date Field',
                            },
                            {
                                name: 'freeTextField',
                                summaryLabel: 'Free text field',
                            }
                        ],
                        renderers: {
                            table: 'FoiAppealsTable'
                        },
                        categoriseBy: 'listServiceField',
                        summaryLabel: 'Test label',
                        showInSummary: true
                    },
                    items: [
                        {
                            listServiceField: 'TESTB',
                            freeTextField: 'free text field',
                            dateField: '1999-12-31',
                            choiceMapField: 'y'
                        }
                    ]
                }
            ],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fetchList: mockFetchList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should transform fully populated case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '2020-01-01', type: 'date' },
                { label: 'Test additional field checkbox', value: 'this,is,a,test', type: 'checkbox' },
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent',
                email: 'test@test.com'
            },
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            previousCase:{
                caseUUID: '__previousCaseUuid__',
                caseReference: '__previousCaseReference__',
                stageUUID: '__previousCaseStageUUID__'
            },
            somuItems: [],
            deadLineExtensions: [],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should map additionalFields data values when choices are provided', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TESTB', choices: [{ value: 'TESTA', label: 'TestA text' }, { value: 'TESTB', label: 'TestB text' }] }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent'
            },
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            previousCase:{
                caseUUID: '__previousCaseUuid__',
                caseReference: '__previousCaseReference__',
                stageUUID: '__previousCaseStageUUID__'
            },
            somuItems: [],
            deadLineExtensions: [],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should map additionalFields data values when choices are provided as list name', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TESTB', choices: 'S_LIST_TEST_VALUES' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent'
            },
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            previousCase:{
                caseUUID: '__previousCaseUuid__',
                caseReference: '__previousCaseReference__',
                stageUUID: '__previousCaseStageUUID__'
            },
            deadLineExtensions: [],
            somuItems: [],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, fetchList: mockFetchList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should not show deadlines when deadlines are disabled', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: false
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '2020-01-01', type: 'date' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent'
            },
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            deadLineExtensions: [],
            type: 'case',
            somuItems: [],
            previousCase:{
                caseUUID: '__previousCaseUuid__',
                caseReference: '__previousCaseReference__',
                stageUUID: '__previousCaseStageUUID__'
            }
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should not show deadlines when summary deadlines are disabled', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: false } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '2020-01-01', type: 'date' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent'
            },
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            deadLineExtensions: [],
            type: 'case',
            somuItems: [],
            previousCase:{
                caseUUID: '__previousCaseUuid__',
                caseReference: '__previousCaseReference__',
                stageUUID: '__previousCaseStageUUID__'
            }
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should populate fields when choices have nested options', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '2020-01-01', type: 'date' },
                { label : 'Topic 22', value: 'mock-value-2', choices: 'TOPIC' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: {
                address: {
                    address1: '__address1__',
                    address2: '__address2__',
                    address3: '__address3__',
                    country: '__country__',
                    postcode: '__postcode__',
                },
                fullname: 'Test Correspondent'
            },
            somuItems: [],
            stageDeadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ],
            deadLineExtensions: [],
            type: 'case'
        };
        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList, fetchList: mockFetchList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

});
