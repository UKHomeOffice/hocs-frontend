const caseTypesAdapter = require('../case-types');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Casetypes Adapter', () => {

    it('should transform and sort user data', async () => {
        const mockData = [
            { label: 'Casetype A', value: 'A' },
            { label: 'Casetype C', value: 'C' },
            { label: 'Casetype B', value: 'B' }
        ];

        const results = await caseTypesAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});