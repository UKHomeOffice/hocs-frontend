import actionModel from '../action';

jest.mock('../../libs/request', () => {
    function handleMockWorkflowCreateRequest(body) {
        if (body.type === 'SUPPORTED_CASETYPE')
            return Promise.resolve();
        else
            return Promise.reject('TEST_ERROR');
    }
    return {
        workflowServiceClient: {
            post: (url, body) => {
                if (url === '/case')
                    return handleMockWorkflowCreateRequest(body);
                if (url === '/case/bulk')
                    return handleMockWorkflowCreateRequest(body);
            }
        }
    };
});

const testCreateCaseForm = {
    schema: {
        fields: [
            {
                component: 'add-document',
                props: {
                    name: 'document_field'
                }
            }
        ]
    },
    data: {
        document_field: [
            {
                originalname: 'test_document.txt',
                type: 'ORIGINAL',
                location: '/location/to/the/file'
            }
        ]
    }
};

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

    it('should return a callback url when "CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: 'CREATE_CASE' };

        const response = await actionModel.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl', '/');
    });

    it('should return an error object when when "CREATE_CASE" action fails', async () => {
        const testForm = { ...testCreateCaseForm, action: 'CREATE_CASE' };

        const response = await actionModel.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
    });

    it('should return a callback url when "BULK_CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: 'BULK_CREATE_CASE' };

        const response = await actionModel.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl', '/');
    });

    it('should return an error object when when "BULK_CREATE_CASE" action fails', async () => {
        const testForm = { ...testCreateCaseForm, action: 'BULK_CREATE_CASE' };

        const response = await actionModel.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm
        });

        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
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