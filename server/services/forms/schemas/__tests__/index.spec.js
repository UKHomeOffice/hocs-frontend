const formRepository = require('../index');

jest.mock('../../../../middleware/somu', () => ({
    getSomuItem: jest.fn(() => Promise.resolve({ data: {} }))
}));

jest.mock('../../../../clients', () => ({
    caseworkService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    workflowService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    },
    infoService: {
        get: jest.fn(() => Promise.resolve({ data: {} }))
    }
}));

jest.mock('../../../../services/list/service', () => ({
    getInstance: function () {
        return {
            fetch: function () {
                return [
                    { isPrimary: false },
                    { isPrimary: true }
                ];
            },
            getFromStaticList: function () {
                return [];
            }
        };
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

describe('Contribution Request', async () => {

    const mpamContributionsRequest = {
        showBusinessUnits: true,
        primaryChoiceLabel: 'Business Area',
        primaryChoiceList: 'MPAM_CONTRIBUTION_BUSINESS_AREAS'
    };

    it('should generate form with action as add', async () => {
        const result = await formRepository.contributionRequest({ user: { id: 1234, roles: [], groups: [] }, action: 'addRequest', customConfig: mpamContributionsRequest });
        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.title).toBeDefined();
        expect(result.schema.title).toEqual('Add Contribution Request');
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.defaultActionLabel).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Add');
    });

    it('should generate form with action as edit', async () => {
        const result = await formRepository.contributionRequest({ user: { id: 1234, roles: [], groups: [] }, action: 'editRequest', customConfig: mpamContributionsRequest });
        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.title).toBeDefined();
        expect(result.schema.title).toEqual('Edit Contribution Request');
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.defaultActionLabel).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Edit');
    });
});
