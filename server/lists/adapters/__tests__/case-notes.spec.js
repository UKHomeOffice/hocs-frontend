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
            { editedTime: '2019-01-03 14:00:00.571 +000', editedName: 'User A', eventTime: '2019-01-01 12:00:00', type: 'MANUAL', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-03 12:00:00', type: 'STAGE_ALLOCATED_TO_USER', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:01', type: 'STAGE_ALLOCATED_TO_TEAM', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'STAGE_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:03', type: 'STAGE_COMPLETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:04', type: 'STAGE_RECREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-07 12:00:00', type: 'CORRESPONDENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-09 12:00:00', type: 'CORRESPONDENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-10 12:00:00', type: 'CASE_TOPIC_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, topicName: '__topic__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-11 12:00:00', type: 'CASE_TOPIC_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, topicName: '__topic__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-08 12:00:00', type: 'CASE_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-06 12:00:00', type: 'CASE_UPDATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-04 12:00:00', type: 'DOCUMENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, documentTitle: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-02 12:00:00', type: 'DOCUMENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, documentTitle: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:00', type: 'CLOSE', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:00', type: 'CHANGE', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-01 12:00:00', type: 'TEST_UNKNOWN_TYPE', userName: 'User A', timelineItemUUID: '__timelineItemUUID__' }
        ];

        const results = await caseNotesAdapter(mockData, { fromStaticList: mockFromStaticList, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});