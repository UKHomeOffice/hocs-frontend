jest.mock('../config/tenant/config.json', () => ({
    'test': {
        'displayName': 'Correspondence System',
        'bulkCreate': true,
        'deadlines': true,
        'autoCreateAndAllocate': false,
        'viewStandardLines': true
    }
}), { virtual: true });

describe('Tenant Config', () => {

    it('should return default config', async () => {
        const tenantConfig = require('../tenantConfig');

        const layout = await tenantConfig.layoutConfig();
        expect(layout).toBeDefined();
        expect(layout.header.service).toEqual('Correspondence System');
        expect(layout.header.bulkCreateEnabled).toEqual(false);
        expect(layout.header.viewStandardLinesEnabled).toEqual(false);
        expect(layout.autoCreateAndAllocateEnabled).toEqual(false);
    });

    describe('using config file with profile', () => {
        beforeAll(() => {
            jest.resetModules();
            process.env.TENANT = 'test';
        });

        afterAll(() => {
            process.env.TENANT = undefined;
        });

        it('should return test config from file', async () => {
            const tenantConfig = require('../tenantConfig');

            const layout = await tenantConfig.layoutConfig();
            expect(layout).toBeDefined();
            expect(layout.header.service).toEqual('Correspondence System');
            expect(layout.header.bulkCreateEnabled).toEqual(true);
            expect(layout.header.viewStandardLinesEnabled).toEqual(true);
            expect(layout.autoCreateAndAllocateEnabled).toEqual(false);
        });
    });

});
