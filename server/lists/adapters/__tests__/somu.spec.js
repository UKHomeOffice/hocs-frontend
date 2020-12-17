const {
    somuTypesAdapter,
    somuItemsAdapter } = require('../somu');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Somu Adapter', () => {

    describe('Somu Type Adapter', () => {
        const mockData = [
            { uuid: '00000000-0000-0000-0000-000000000000', caseType: 'TestCaseType', type: 'TestType', schema: '{"test":1}', active: true }
        ];

        it('should transform somu type', async () => {
            const results = await somuTypesAdapter(mockData, { logger: mockLogger });

            expect(results).toBeDefined();
            expect(results).toMatchSnapshot();
        });
    });

    describe('Somu Item Adapter', () => {

        it('should transform somu type with data', async () => {
            const mockData = { uuid: '00000000-0000-0000-0000-000000000000', data: '[{"test":1}]', deleted: false };

            const results = await somuItemsAdapter(mockData, { logger: mockLogger });

            expect(results).toBeDefined();
            expect(results).toMatchSnapshot();
        });

        it('should transform somu type with deleted set as true', async () => {
            const mockData = { uuid: '00000000-0000-0000-0000-000000000000', data: null, deleted: true };

            const results = await somuItemsAdapter(mockData, { logger: mockLogger });

            expect(results).toBeDefined();
            expect(results).toMatchSnapshot();
        });
    });

});