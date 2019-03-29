const actionService = require('../action');
const actionTypes = require('../actions/types');

const mockRequestClient = jest.fn();

jest.mock('../../clients', () => {
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
        workflowService: {
            post: (url, body) => {
                if (url === '/case') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                if (url === '/case/bulk') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                mockRequestClient(body);
            },
            delete: (url, body) => {
                mockRequestClient(body);
            }
        },
        caseworkService: {
            post: (url, body) => {
                if (url === '/case') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                if (url === '/case/bulk') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                mockRequestClient(body);
            },
            delete: (url, body) => {
                mockRequestClient(body);
            }
        },
        documentService: {
            post: (url, body) => {
                if (url === '/case') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                if (url === '/case/bulk') {
                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                mockRequestClient(body);
            },
            delete: (url, body) => {
                mockRequestClient(body);
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
                key: '/location/to/the/file'
            }
        ]
    },
    next: {
        action: 'CONFIRMATION_SUMMARY'
    }
};

const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };

describe('Action service', () => {

    beforeEach(() => {
        mockRequestClient.mockReset();
    });
    it('should return a callback url when passed supported workflow and action', async () => {
        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
            },
            user: mockUser
        });

        expect(response).toBeDefined();
        expect(mockRequestClient).toHaveBeenCalledTimes(0);
        expect(response).toHaveProperty('callbackUrl', '/');
    });

    it('should return a callback url when "CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: actionTypes.CREATE_CASE };

        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(createCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return an error object when "CREATE_CASE" action fails', () => {
        const testForm = { ...testCreateCaseForm, action: actionTypes.CREATE_CASE };

        actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm,
            user: mockUser
        })
            .then(() => { })
            .catch(e => { expect(e).toBeInstanceOf(Error); });
    });

    it('should return a callback url when "BULK_CREATE_CASE" action succeeds', async () => {
        const testForm = { ...testCreateCaseForm, action: actionTypes.BULK_CREATE_CASE };

        const response = await actionService.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'SUPPORTED_CASETYPE',
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(createCaseRequest);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return an error object when when "BULK_CREATE_CASE" action fails', () => {
        const testForm = { ...testCreateCaseForm, action: actionTypes.BULK_CREATE_CASE };

        actionService.performAction('ACTION', {
            workflow: 'BULK',
            action: 'WORKFLOW',
            context: 'UNSUPPORTED_CASETYPE',
            form: testForm,
            user: mockUser
        })
            .then(() => { })
            .catch(e => { expect(e).toBeInstanceOf(Error); });
    });

    it('should return error object when passed unsupported form action', () => {

        actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {
                action: 'SOME_RANDOM_ACTION'
            },
            user: mockUser
        })
            .then(() => { })
            .catch(e => { expect(e).toBeInstanceOf(Error); });
    });

    it('should return a callback url when "ADD_DOCUMENT" action succeeds', async () => {
        const testForm = {
            schema: {
                fields: [{ component: 'add-document', props: { name: 'document_field', documentType: 'ORIGINAL' } }]
            },
            data: {
                document_field: [{ originalname: 'test_document.txt', key: '/location/to/the/file' }]
            },
            action: actionTypes.ADD_DOCUMENT
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'document',
            context: null,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "REMOVE_DOCUMENT" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.REMOVE_DOCUMENT
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'document',
            context: 1234,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "ADD_TOPIC" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: { topic: 'TEST_TOPIC' },
            action: actionTypes.ADD_TOPIC
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'topic',
            context: null,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith({ topicUUID: 'TEST_TOPIC' });
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "REMOVE_TOPIC" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.REMOVE_TOPIC
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'topic',
            context: 1234,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "ADD_CORRESPONDENT" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.ADD_CORRESPONDENT
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'topic',
            context: null,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "ADD_MEMBER" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.ADD_MEMBER
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'correspondent',
            context: null,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

    it('should return a callback url when "REMOVE_CORRESPONDENT" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.REMOVE_CORRESPONDENT
        };
        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            entity: 'correspondent',
            context: 1234,
            form: testForm,
            user: mockUser
        });
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl');
    });

});