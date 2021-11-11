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

const caseActionData = {
    'APPEAL': [
        {
            'id': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
            'typeInfo': {
                'uuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'APPEAL',
                'actionLabel': 'Court of Appeal',
                'maxConcurrentEvents': 1,
                'sortOrder': 50,
                'active': true,
                'props': '{}'
            },
            'typeData': [
                {
                    'actionType': 'APPEAL',
                    'status': 'Complete',
                    'dateSentRMS': '2021-10-12',
                    'outcome': 'ComplaintUpheld',
                    'complexCase': 'Yes',
                    'note': 'sdcasdc',
                    'appealOfficerData': null,
                    'uuid': 'e2e033ef-a819-4ea8-b793-aa1b9eadf3e2',
                    'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                    'caseTypeActionLabel': 'Court of Appeal'
                }
            ]
        },
        {
            'id': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
            'typeInfo': {
                'uuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'APPEAL',
                'actionLabel': 'First Tier Tribunal',
                'maxConcurrentEvents': 1,
                'sortOrder': 30,
                'active': true,
                'props': '{}'
            },
            'typeData': [
                {
                    'actionType': 'APPEAL',
                    'status': 'Complete',
                    'dateSentRMS': '2021-10-26',
                    'outcome': 'DecisionUpheld',
                    'complexCase': 'Yes',
                    'note': 'asdfasdf',
                    'appealOfficerData': null,
                    'uuid': 'f5868426-fdaa-4148-89ba-aa93c6989919',
                    'caseTypeActionUuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                    'caseTypeActionLabel': 'First Tier Tribunal'
                }
            ]
        },
        {
            'id': '268277ef-6b44-4cb3-a0f9-1a717322685b',
            'typeInfo': {
                'uuid': '268277ef-6b44-4cb3-a0f9-1a717322685b',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'APPEAL',
                'actionLabel': 'ICO Review',
                'maxConcurrentEvents': 1,
                'sortOrder': 20,
                'active': true,
                'props': '{}'
            },
            'typeData': []
        },
        {
            'id': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
            'typeInfo': {
                'uuid': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'APPEAL',
                'actionLabel': 'Internal Review',
                'maxConcurrentEvents': 1,
                'sortOrder': 10,
                'active': true,
                'props': '{"appealOfficerData": {"officer": {"label": "Internal review officer name", "value": "IROfficerName", "choices": "S_FOI_KIMU_TEAM_MEMBERS"}, "directorate": {"label": "Internal review officer directorate", "value": "IROfficerDirectorate", "choices": "S_FOI_DIRECTORATES"}}}'
            },
            'typeData': []
        },
        {
            'id': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
            'typeInfo': {
                'uuid': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'APPEAL',
                'actionLabel': 'Upper Tribunal',
                'maxConcurrentEvents': 1,
                'sortOrder': 40,
                'active': true,
                'props': '{}'
            },
            'typeData': []
        }
    ],
    'EXTENSION': [
        {
            'id': 'dd84d047-853b-428a-9ed7-94601623f344',
            'typeInfo': {
                'uuid': 'dd84d047-853b-428a-9ed7-94601623f344',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'EXTENSION',
                'actionLabel': 'PIT Extension',
                'maxConcurrentEvents': 1,
                'sortOrder': 10,
                'active': true,
                'props': '{"extendFrom": "TODAY", "extendByMaximumDays": 20}'
            },
            'typeData': []
        }
    ],
    'EXTERNAL_INTEREST': [
        {
            'id': '81ed796d-819c-46ce-bf50-beca3abe0845',
            'typeInfo': {
                'uuid': '81ed796d-819c-46ce-bf50-beca3abe0845',
                'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                'caseType': 'FOI',
                'actionType': 'EXTERNAL_INTEREST',
                'actionLabel': 'External Interest',
                'maxConcurrentEvents': 99999,
                'sortOrder': 10,
                'active': true,
                'props': ''
            },
            'typeData': [
                {
                    'uuid': 'e2e033ef-a819-4ea8-b793-aa1b9eadf3e2',
                    'caseTypeActionUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d'
                }
            ]
        }
    ],
    'currentDeadline': '24/11/2021'
};


describe('Form schema definitions', () => {
    Object.entries(formRepository).map(async ([label, form]) => {
        it(`${label} should be a valid schema definition `, async () => {

            const caseActionId = 'e2e033ef-a819-4ea8-b793-aa1b9eadf3e2';

            const result = await form.call(this, { user: { id: 1234, roles: [], groups: [] }, caseActionData, caseActionId });
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
