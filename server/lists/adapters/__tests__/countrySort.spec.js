const countrySortAdapter = require('../countrySort');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Country Sort Adapter', () => {

    it('should transform and sort country data', async () => {
        const mockData = [
            'Country B',
            'Country C',
            'Country A'
        ];

        const results = await countrySortAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });

    it('should sort United Kingdom to top', async () => {
        const mockData = [
            'Country B',
            'Country A',
            'United Kingdom'
        ];

        const results = await countrySortAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});