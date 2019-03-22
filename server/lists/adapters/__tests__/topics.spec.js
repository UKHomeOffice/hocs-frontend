const topicsAdapter = require('../topics');

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

        const results = await topicsAdapter(mockData);

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});