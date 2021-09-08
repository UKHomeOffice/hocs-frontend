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
            }
        };
    }
}));


describe('Form schema definitions', () => {
    Object.entries(formRepository).map(async ([label, form]) => {
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

describe('Contribution Request', () => {

    const mpamContributionsRequest = {
        showBusinessUnits: true,
        primaryChoiceLabel: 'Business Area',
        primaryChoiceList: 'MPAM_CONTRIBUTION_BUSINESS_AREAS'
    };

    const exgratiaContritbutionRequest = {
        showBusinessUnits: false,
        primaryChoiceLabel: 'Business Area Representative',
        primaryChoiceList: 'EX_GRATIA_BUS_REPS',
        showContributionAmount: true
    };

    it('should generate form with action as add', async () => {
        const result = await formRepository.contributionRequest({ user: { id: 1234, roles: [], groups: [] }, action: 'addRequest', customConfig: mpamContributionsRequest });
        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.title).toBeDefined();
        expect(result.schema.title).toEqual('Add Contribution Request');
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.fields.length).toEqual(5);
        expect(result.schema.fields[0].props.label).toEqual('Business Area');
        expect(result.schema.fields[1].props.label).toEqual('Business Unit');
        expect(result.schema.fields[2].props.label).toEqual('Contribution request date');
        expect(result.schema.fields[3].props.label).toEqual('Contribution due date');
        expect(result.schema.fields[4].props.label).toEqual('What you are requesting');
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
        expect(result.schema.fields.length).toEqual(5);
        expect(result.schema.fields[0].props.label).toEqual('Business Area');
        expect(result.schema.fields[1].props.label).toEqual('Business Unit');
        expect(result.schema.fields[2].props.label).toEqual('Contribution request date');
        expect(result.schema.fields[3].props.label).toEqual('Contribution due date');
        expect(result.schema.fields[4].props.label).toEqual('What you are requesting');
        expect(result.schema.defaultActionLabel).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Edit');
    });

    it('should generate form with optional request amount field', async () => {
        const result = await formRepository.contributionRequest({ user: { id: 1234, roles: [], groups: [] }, action: 'addRequest', customConfig: exgratiaContritbutionRequest });
        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.title).toBeDefined();
        expect(result.schema.title).toEqual('Add Contribution Request');
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.fields.length).toEqual(5);
        expect(result.schema.fields[0].props.label).toEqual('Business Area Representative');
        expect(result.schema.fields[1].props.label).toEqual('Contribution request date');
        expect(result.schema.fields[2].props.label).toEqual('Contribution due date');
        expect(result.schema.fields[3].props.label).toEqual('Contribution Amount (£)');
        expect(result.schema.fields[4].props.label).toEqual('What you are requesting');
        expect(result.schema.defaultActionLabel).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Add');
    });
});
