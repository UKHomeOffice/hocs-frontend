const caseSummaryAdapter = require('../case-summary');

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

describe('Case Summary Adapter', () => {

    it('should transform minimal case summary data', async () => {
        const mockData = {
            dateReceived: '2019-01-01',
            caseDeadline: null,
            primaryTopic: null,
            primaryCorrespondent: null,
            deadlines: [],
            activeStages: []
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should transform fully populated case summary data', async () => {
        const mockData = {
            dateReceived: '2019-01-01',
            caseDeadline: '2020-01-01',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '2020-01-01', type: 'date' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: { fullname: 'Test Correspondent' },
            deadlines: {
                1: '2020-01-01',
                2: '2019-01-01',
                3: '2019-01-06'
            },
            activeStages: [
                { stage: 1, assignedToUserUUID: 1, assignedToTeamUUID: 1 }
            ]
        };

        const results = await caseSummaryAdapter(mockData, { fromStaticList: mockFromStaticList });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

});