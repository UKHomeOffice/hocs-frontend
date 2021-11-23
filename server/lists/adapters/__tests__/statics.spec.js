const { usersAdapter, teamsAdapter, caseTypesAdapter, stageTypesAdapter } = require('../statics');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Static Users Adapter', () => {
    it('should transform static user data', async () => {
        const mockData = [
            { username: 'User A', id: 1 },
            { username: 'User C', id: 3 },
            { username: 'User B', id: 2 }
        ];

        const results = await usersAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Static Teams Adapter', () => {
    it('should transformstatic team data', async () => {
        const mockData = [
            { displayName: 'Team A', type: 'TEAM_A' },
            { displayName: 'Team C', type: 'TEAM_C' },
            { displayName: 'Team B', type: 'TEAM_B' }
        ];

        const results = await teamsAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Static Casetypes Adapter', () => {
    it('should transform static casetype data', async () => {
        const mockData = [
            { label: 'Casetype A', value: 'CASETYPE_A' },
            { label: 'Casetype C', value: 'CASETYPE_C' },
            { label: 'Casetype B', value: 'CASETYPE_B' }
        ];

        const results = await caseTypesAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Static Stagetypes Adapter', () => {
    it('should transform and stagetype data', async () => {
        const mockData = [
            { label: 'Stagetype A', value: 'STAGETYPE_A' },
            { label: 'Stagetype C', value: 'STAGETYPE_C' },
            { label: 'Stagetype B', value: 'STAGETYPE_B' }
        ];

        const results = await stageTypesAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});