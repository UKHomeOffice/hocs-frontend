const caseNotesAdapter = require('../case-notes');

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

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Case Notes Adapter', () => {

    it('should transform case-note data and sort by event time', async () => {
        const mockData = [
            { eventTime: '2019-01-01', type: 'MANUAL', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-03', type: 'STAGE_ALLOCATED_TO_USER', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-05', type: 'STAGE_ALLOCATED_TO_TEAM', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-07', type: 'CORRESPONDENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-09', type: 'CORRESPONDENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-10', type: 'CASE_TOPIC_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-11', type: 'CASE_TOPIC_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-08', type: 'CASE_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 } },
            { eventTime: '2019-01-06', type: 'CASE_UPDATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: "test topic", correspondent: "test correspondent" } },
            { eventTime: '2019-01-04', type: 'DOCUMENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: "test topic", correspondent: "test correspondent" } },
            { eventTime: '2019-01-02', type: 'DOCUMENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: "test topic", correspondent: "test correspondent" } },
            { eventTime: '2019-01-01', type: 'TEST_UNKNOWN_TYPE', userName: 'User A' }
        ];

        const results = await caseNotesAdapter(mockData, { fromStaticList: mockFromStaticList, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});