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
        case 'FAKE_USERS':
            return [{
                value: '638b31bc-6004-4f51-8394-45c3141e1f8a',
                label: 'User Name'
            }];
        case 'FAKE_TEAMS':
            return [{
                value: 'FOI_DIRECTORATE_HMPO_ACCEPTANCE_TEAMS',
                label: 'HMPO Acceptance Team'
            }];
        default:
            return null;
    }
});

describe('Case Summary Adapter', () => {

    it('should transform minimal case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }).catch((error) => {}));
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

    it('should transform actions data in case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }).catch((error) => {}));
        const mockConfiguration = {
            deadlinesEnabled: true
        };

        const mockData = {
            actions: {
                caseActionData: {
                    'appeals': [
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-26',
                            'outcome': 'ComplaintUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdcasdc',
                            'appealOfficerData': '{"IROfficerName": "638b31bc-6004-4f51-8394-45c3141e1f8a", "IROfficerDirectorate": "FOI_DIRECTORATE_HMPO_ACCEPTANCE_TEAMS"}',
                            'uuid': '72fd3cf4-f15a-4c20-90d4-90d1a663e2f5',
                            'caseTypeActionUuid': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                            'caseTypeActionLabel': 'Internal Review'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'ComplaintUpheld',
                            'complexCase': 'Yes',
                            'note': 'sdcasdc',
                            'appealOfficerData': null,
                            'uuid': 'e2e033ef-a819-4ea8-b793-aa1b9eadf3e2',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-26',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdfasdf',
                            'appealOfficerData': null,
                            'uuid': 'f5868426-fdaa-4148-89ba-aa93c6989919',
                            'caseTypeActionUuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                            'caseTypeActionLabel': 'First Tier Tribunal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdcasd',
                            'appealOfficerData': null,
                            'uuid': '50792f80-3f74-4eab-be86-a96e0e0749da',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'sdcasdc',
                            'appealOfficerData': null,
                            'uuid': '5fcad74b-3577-49eb-893d-5923c771c2f4',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        }
                    ],
                    'extensions': [
                        {
                            'actionType': 'EXTENSION_OUT',
                            'originalDeadline': '2021-11-24',
                            'updatedDeadline': '2021-11-24',
                            'note': 'Whatever you want to write here',
                            'uuid': '8ffa52b9-1e31-4412-ac50-ce086cec1b51',
                            'caseTypeActionUuid': 'dd84d047-853b-428a-9ed7-94601623f344',
                            'caseTypeActionLabel': 'PIT Extension'
                        }
                    ]
                },
                caseTypeActionData: [{
                    uuid: 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                    props: '{}',
                }, {
                    uuid: 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                    props: '{}'
                }, {
                    uuid: 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                    props: JSON.stringify({
                        appealOfficerData: {
                            officer: {
                                choices: 'FAKE_USERS',
                                value: 'IROfficerName'
                            },
                            directorate: {
                                choices: 'FAKE_TEAMS',
                                value: 'IROfficerDirectorate'
                            }
                        }
                    })
                }]
            },
            dateReceived: '2019-01-01',
            caseCreated: '2019-02-03',
            caseDeadline: null,
            primaryTopic: null,
            primaryCorrespondent: null,
            stageDeadlines: [],
            activeStages: [],
            deadLineExtensions: [],
            type: 'case'
        };

        const results = await caseSummaryAdapter(mockData, { fetchList: mockFetchList, configuration: mockConfiguration, user: mockUser });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should transform fully populated case summary data', async () => {
        caseworkService.get.mockImplementation(() => Promise.resolve({ data: { summaryDeadlineEnabled: true } }).catch((error) => {}));
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
                email: 'test@test.com',
                telephone: '11111111111'
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
