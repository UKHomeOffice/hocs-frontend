const formRepository = require('../index');

jest.mock('../../../../libs/request.js', () => ({
    caseworkServiceClient: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    workflowServiceClient: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    infoServiceClient: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    docsServiceClient: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    }
}));

jest.mock('../../../../services/list.js', () => ({
    getList: jest.fn(() => Promise.resolve([]))
}));

describe('Form schema definitions', async () => {
    await Object.entries(formRepository).map(async ([label, form]) => {
        it(`${label} should be a valid schema definition `, async () => {
            const result = await form.call(this, {});
            expect(result).toBeDefined();
            expect(result.schema).toBeDefined();
            expect(result.schema.title).toBeDefined();
            expect(result.schema.fields).toBeDefined();
            expect(result.schema.defaultActionLabel).toBeDefined();
        });
    });
});