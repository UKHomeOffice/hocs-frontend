const entityListItemsAdapter = require('../entityListItems');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Entity List Items Adapter', () => {

    it('should transform data', async () => {
        const mockData = [
            { simpleName: 'First', data: { title: 'Title First' }, active: true },
            { simpleName: 'Second', data: { title: 'Title Second' }, active: true },
            { simpleName: 'Third', data: { title: 'Title Third' }, active: false },
        ];

        const results = await entityListItemsAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});
