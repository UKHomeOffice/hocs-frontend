const documentListAdapter = require('../documentList');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Documents List Adapter', () => {

    it('should transform document data and sort by creation date', async () => {
        const mockData = {
            documents: [
                { created: '02-01-2019', displayName: 'Document A', uuid: 1 },
                { created: '01-01-2019', displayName: 'Document B', uuid: 2 },
                { created: '03-01-2019', displayName: 'Document C', uuid: 3 },
            ]
        };

        const results = await documentListAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});