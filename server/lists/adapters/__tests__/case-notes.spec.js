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

const mockFetchList = jest.fn((list, body) => {
    if(list === 'CASE_ACTION_LABEL' && body && body.actionId === '__caseTypeActionUuid__') {
        return '__caseTypeActionLabel__';
    } else if (list === 'FOI_INTERESTED_PARTIES') {
        return [
            {
                value: '__partyType__',
                label: '__partyLabel__'
            },
            {
                value: '__partyType_2__',
                label: '__partyLabel_2__'
            }
        ];
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
            { eventTime: '2019-01-05 12:00:05', type: 'STAGE_ALLOCATED_TO_TEAM', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:06', type: 'STAGE_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:07', type: 'STAGE_COMPLETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:08', type: 'STAGE_RECREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-07 12:00:00', type: 'CORRESPONDENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-07 12:00:00', type: 'CORRESPONDENT_UPDATED', userName: 'User A', body: {
                'type': 'FOI Requester',
                'uuid': 'f59dc3af-0438-439f-a20f-806980164377',
                'email': 'Tester@example.org',
                'fullname': 'Mr. Tester 3',
            }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-09 12:00:00', type: 'CORRESPONDENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-10 12:00:00', type: 'CASE_TOPIC_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, topicName: '__topic__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-11 12:00:00', type: 'CASE_TOPIC_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, topicName: '__topic__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-08 12:00:00', type: 'CASE_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-06 12:00:00', type: 'CASE_UPDATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-06 12:00:00', type: 'APPEAL_UPDATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, document: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-04 12:00:00', type: 'DOCUMENT_CREATED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, documentTitle: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-02 12:00:00', type: 'DOCUMENT_DELETED', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1, documentTitle: 'test document', topic: 'test topic', fullname: 'test correspondent' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:01', type: 'CLOSE', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:03', type: 'CHANGE', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'CASE_TRANSFER_REASON', userName: 'User A', body: { caseNote: 'A test transfer reason case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'EXTENSION', userName: 'User A', body: { caseNote: 'An extension reason case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:05', type: 'ENQUIRY_REASON_EUNATIONAL_OTHERDETAILS', userName: 'User A', body: { caseNote: 'A test case note', userUUID: 1, teamUUID: 1, stage: 1 }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'APPEAL_CREATED', userName: 'User A', body: { userUUID: 1, teamUUID: 1, stage: 1, caseTypeActionUuid: '__caseTypeActionUuid__'  }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'APPEAL_UPDATED', userName: 'User A', body: { userUUID: 1, teamUUID: 1, stage: 1, caseTypeActionUuid: '__caseTypeActionUuid__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'EXTERNAL_INTEREST_CREATED', userName: 'User A', body: { caseType: 'FOI', userUUID: 1, teamUUID: 1, stage: 1, note: 'Details of interest', partyType: '__partyType__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'EXTERNAL_INTEREST_UPDATE', userName: 'User A', body: { caseType: 'FOI', userUUID: 1, teamUUID: 1, stage: 1, note: 'Updated details of interest', partyType: '__partyType_2__' }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-01 12:00:00', type: 'TEST_UNKNOWN_TYPE', userName: 'User A', timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:02', type: 'DATA_FIELD_UPDATED', userName: 'User A', body: { fieldName: 'fieldName', fieldNameLabel: 'Field Name', newValue: 'newValue', newValueLabel: 'New Value', previousValue: null, previousValueLabel: null }, timelineItemUUID: '__timelineItemUUID__' },
            { eventTime: '2019-01-05 12:00:05', type: 'DATA_FIELD_UPDATED', userName: 'User A', body: { fieldName: 'fieldName', fieldNameLabel: 'Field Name', newValue: 'newValue', newValueLabel: 'Updated Value', previousValue: 'previousValue', previousValueLabel: 'Previous Value'}, timelineItemUUID: '__timelineItemUUID__' },
        ];

        const results = await caseNotesAdapter(mockData, { fromStaticList: mockFromStaticList, fetchList: mockFetchList, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});
