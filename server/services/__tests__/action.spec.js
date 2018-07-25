import actionModel from '../action';

describe('Action model', () => {
    it('should return a callback url when passed supported workflow and action', async () => {
        const response = await actionModel.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
            }
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl', '/');
    });

    it('should return error object when passed unsupported form action', async () => {

        const response = await actionModel.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
                action: 'SOME_RANDOM_ACTION'
            },
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
    });
});