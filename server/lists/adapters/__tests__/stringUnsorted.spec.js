const stringUnsortedAdapter = require('../stringUnsorted');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('String Unsorted Adapter', () => {

    it('should transform but not sort string data', async () => {
        const mockData = [
            'String B',
            'String C',
            'String A'
        ];

        const results = await stringUnsortedAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});