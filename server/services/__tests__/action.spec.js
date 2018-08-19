import actionService from '../action';

const mockRequestClient = jest.fn();

jest.mock('../../libs/request', () => {
    function handleMockWorkflowCreateRequest(body) {
        if (body.type === 'SUPPORTED_CASETYPE')
            return Promise.resolve({
                data: {
                    reference: 'CASE_REFERENCE'
                }
            });
        else
            return Promise.reject('TEST_ERROR');
    }
    return {
        workflowServiceClient: {
            post: (url, body) => {
                if (url === '/case') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                if (url === '/case/bulk') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
            }
        }
    };
});

const createCaseRequest = {
    type: 'SUPPORTED_CASETYPE',
    documents: [
        {
            displayName: 'test_document.txt',
            type: 'ORIGINAL',
            s3UntrustedUrl: '/location/to/the/file'
        }
    ]
};

const testCreateCaseForm = {
    schema: {
        fields: [
            {
                component: 'add-document',
                props: {
                    name: 'document_field',
                    documentType: 'ORIGINAL'
                }
            }
        ]
    },
    data: {
        document_field: [
            {
                originalname: 'test_document.txt',
                location: '/location/to/the/file'
            }
        ]
    },
    next: {
        action: 'CONFIRMATION_SUMMARY'
    }
};

describe('Action service', () => {
    beforeEach(() => {
        mockRequestClient.mockReset();
    });
    it('should return a callback url when passed supported workflow and action', async () => {
        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
            }
        });

        expect(response).toBeDefined();
        expect(mockRequestClient).toHaveBeenCalledTimes(0);
        expect(response).toHaveProperty('callbackUrl', '/');
    });

    it('should return a callback url when "CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: 'CREATE_CASE' };

        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(createCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return an error object when when "CREATE_CASE" action fails', async () => {
        const testForm = { ...testCreateCaseForm, action: 'CREATE_CASE' };

        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        const unsupportedCasetypeCreateCaseRequest = { ...createCaseRequest, type: 'UNSUPPORTED_CASETYPE' };
        expect(mockRequestClient).toHaveBeenCalledWith(unsupportedCasetypeCreateCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
    });

    it('should return a callback url when "BULK_CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: 'BULK_CREATE_CASE' };

        const response = await actionService.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(createCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return an error object when when "BULK_CREATE_CASE" action fails', async () => {
        const testForm = { ...testCreateCaseForm, action: 'BULK_CREATE_CASE' };

        const response = await actionService.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        const unsupportedCasetypeCreateCaseRequest = { ...createCaseRequest, type: 'UNSUPPORTED_CASETYPE' };
        expect(mockRequestClient).toHaveBeenCalledWith(unsupportedCasetypeCreateCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
    });

    it('should return error object when passed unsupported form action', async () => {

        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
                action: 'SOME_RANDOM_ACTION'
            },
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(0);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('error');
    });
});