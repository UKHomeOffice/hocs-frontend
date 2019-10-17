const stringSortedAdapter = require('../stringSorted');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('String Sorted Adapter', () => {

    it('should transform and sort string data', async () => {
        const mockData = [
            "String B",
            "String C",
            "String A"
        ];

        const results = await stringSortedAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});