const documentsAdapter = require('../documents');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

const mockConfig = {
    documentLabels: ['type1', 'type2', 'type3']
};

describe('Documents Adapter', () => {

    it('should transform document data and sort by creation date descending', async () => {
        const mockData = {
            documents: [
                { created: '02-01-2019', displayName: 'Document A', type: 'type1', uuid: 1 },
                { created: '01-01-2019', displayName: 'Document B', type: 'type1', uuid: 2 },
                { created: '03-01-2019', displayName: 'Document C', type: 'type2', uuid: 3 },
            ]
        };

        const results = await documentsAdapter(mockData, { configuration: mockConfig, logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});