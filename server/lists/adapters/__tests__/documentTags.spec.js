const documentTagsAdapter = require('../documentTags');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Document Tags Adapter', () => {

    it('should transform document tags data', async () => {
        const mockData = [
            'Tag 1',
            'Tag 2'
        ];

        const results = await documentTagsAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});