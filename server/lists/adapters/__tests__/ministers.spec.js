const ministerAdapter = require('../ministers');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Minister Adapter', () => {
    it('should transform and sort minister data', async () => {
        const mockData = {
            ministers: [
                { label: 'Minister A', value: 1 },
                { label: 'Minister C', value: 3 },
                { label: 'Minister B', value: 2 }
            ]
        };

        const results = await ministerAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});