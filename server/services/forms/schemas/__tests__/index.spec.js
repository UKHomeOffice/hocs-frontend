const formRepository = require('../index');

jest.mock('../../../../clients', () => ({
    caseworkService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    workflowService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    infoService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    documentService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    }
}));

describe('Form schema definitions', async () => {
    await Object.entries(formRepository).map(async ([label, form]) => {
        it(`${label} should be a valid schema definition `, async () => {
            const result = await form.call(this, { user: { id: 1234, roles: [], groups: [] } });
            expect(result).toBeDefined();
            expect(result.schema).toBeDefined();
            expect(result.schema.title).toBeDefined();
            expect(result.schema.fields).toBeDefined();
            expect(result.schema.defaultActionLabel).toBeDefined();
        });
    });
});