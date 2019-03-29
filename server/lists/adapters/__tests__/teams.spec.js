const teamsAdapter = require('../teams');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('User Adapter', () => {

    it('should transform and sort team data', async () => {
        const mockData = [
            { displayName: 'Team B', type: 'TEAM_B' },
            { displayName: 'Team A', type: 'TEAM_A' },
            { displayName: 'Team C', type: 'TEAM_C' },
        ];

        const results = await teamsAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});