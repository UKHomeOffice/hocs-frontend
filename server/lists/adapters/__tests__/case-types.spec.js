const caseTypesAdapter = require('../case-types');

describe('Casetypes Adapter', () => {

    it('should transform and sort user data', async () => {
        const mockData = {
            caseTypes: [
                { label: 'Casetype A', value: 'A' },
                { label: 'Casetype C', value: 'C' },
                { label: 'Casetype B', value: 'B' }
            ]
        };

        const results = await caseTypesAdapter(mockData);
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});