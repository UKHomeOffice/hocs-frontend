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
            dateReceived: '01-01-2019',
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
            dateReceived: '01-01-2019',
            caseDeadline: '01-01-2020',
            additionalFields: [
                { label: 'Test field', value: 'TEST' },
                { label: 'Test additional field date', value: '01-01-2020', type: 'date' }
            ],
            primaryTopic: { label: 'Topic A' },
            primaryCorrespondent: { fullname: 'Test Correspondent' },
            deadlines: {
                1: '01-01-2020',
                2: '01-01-2019',
                3: '01-06-2019'
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