const templatesAdapter = require('../templates');

describe('Template Adapter', () => {

    it('should transform template data', async () => {
        const mockData = [{
            displayName: 'MOCK_TEMPLATE',
            documentUUID: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
        }];

        const results = await templatesAdapter(mockData);

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});