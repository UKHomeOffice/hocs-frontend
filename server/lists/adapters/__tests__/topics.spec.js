const topicsAdapter = require('../topics');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Topic Adapter', () => {
    it('should transform and sort topic data', async () => {
        const mockData = {
            parentTopics: [
                {
                    options: [
                        { label: 'b', value: 2 },
                        { label: 'a', value: 1 },
                        { label: 'c', value: 3 }
                    ]
                }
            ]
        };

        const results = await topicsAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});