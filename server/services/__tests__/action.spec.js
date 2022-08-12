const actionService = require('../action');
const actionTypes = require('../actions/types');

const mockRequestClient = jest.fn();

jest.mock('../list/service', () => {
    return {
        getInstance: () => {
            return {
                fetch: (listId) => {
                    if (listId === 'FOI_APPEAL_TYPES') {
                        return [
                            {
                                label: 'Appeal type A',
                                value: 'APPEAL_TYPE_A'
                            },
                            {
                                label: 'Appeal type B',
                                value: 'APPEAL_TYPE_B'
                            },
                            {
                                label: 'Appeal type C',
                                value: 'APPEAL_TYPE_C'
                            }
                        ];
                    } else {
                        return {};
                    }
                }
            };
        }
    };
});

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
                if (url == '/case/1234/stage/5678') {
                    mockRequestClient(body);
                    return  Promise.resolve({
                        data: {
                            form: {},
                            stageUUID: '123abc'
                        }
                    });
                }
                mockRequestClient(body);
            },
            delete: (url, body) => {
                mockRequestClient(body);
            }
        },
        caseworkService: {
            post: (url, body) => {
                if (url.match(/case\/.*\/stage\/.*\/actions\/.*/)) {

                    mockRequestClient(body);
                    return { data: { reference: '__test_ref__' } };
                }

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
            put: (url, body) => {

                if (url.match(/case\/.*\/stage\/.*\/actions\/.*/)) {

                    mockRequestClient(body);
                    return { data: { reference: '__test_ref__' } };
                }

                if (url === '/case') {
                    body.reference = '__test_ref__';

                    mockRequestClient(body);
                    return handleMockWorkflowCreateRequest(body);
                }
                mockRequestClient(body);
            },
            delete: (url, body) => {
                mockRequestClient(body);
            },
            get: (url) => {
                mockRequestClient(url);

                return {
                    data: {
                        caseDeadline: '2021-01-10'
                    }
                };
            }
        },
        infoService: {
            get: jest.fn(() => Promise.resolve({ data: ['ORIGINAL', 'DRAFT'] }))
        }
    };
});


const createCaseRequest = {
    type: 'SUPPORTED_CASETYPE',
    dateReceived: '2021-07-09',
    data: {
        document_field: [
            {
                originalname: 'test_document.txt',
                key: '/location/to/the/file'
            }
        ]
    },
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
        DateReceived: '2021-07-09',
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

    it('handleWorkflowSuccess - with form data returned from back end', async () => {

        const FORM_DATA = { data: { 'a': 's' } };

        const response = await actionService.performAction('WORKFLOW', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: FORM_DATA,
            user: mockUser,
            caseId: '1234',
            stageId: '5678'
        });

        expect(response).toBeDefined();
        expect(mockRequestClient).toHaveBeenCalledWith(FORM_DATA);
        expect(response).toHaveProperty('callbackUrl', '/case/1234/stage/123abc');
    });

    it('should return a callback url when passed supported workflow and action', async () => {
        const response = await actionService.performAction('ACTION', {
            workflow: 'CREATE',
            action: 'WORKFLOW',
            form: {},
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
            .then(() => {
            })
            .catch(e => {
                expect(e).toBeInstanceOf(Error);
            });
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
            .then(() => {
            })
            .catch(e => {
                expect(e).toBeInstanceOf(Error);
            });
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
            .then(() => {
            })
            .catch(e => {
                expect(e).toBeInstanceOf(Error);
            });
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

    it('should return a callback url when "UPDATE_CORRESPONDENT" action succeeds', async () => {
        const testForm = {
            schema: {},
            data: {},
            action: actionTypes.UPDATE_CORRESPONDENT
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


    it('should return a callback url when "APPLY_CASE_DEADLINE_EXTENSION" action succeeds', async () => {
        const originalNowFunc = Date.now;
        Date.now = jest.fn(() =>
            new Date(Date.UTC(2021, 0, 10, 12)).valueOf());

        const testForm = {
            schema: {
                fields: []
            },
            data: {
                caseTypeActionUuid: '__uuid__',
                extendBy: 20,
                extendFrom: 'ANY',
                note: 'SOME NOTE',
                document_type: 'PIT Extension'
            },
            action: actionTypes.APPLY_CASE_DEADLINE_EXTENSION,
            next: {
                action: 'CONFIRMATION_SUMMARY'
            }
        };

        const expectedBody = {
            actionType: 'EXTENSION',
            caseTypeActionUuid: '__uuid__',
            extendBy: 20,
            extendFrom: 'ANY',
            note: 'SOME NOTE'
        };

        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            caseActionType: 'extension',
            context: null,
            form: testForm,
            user: mockUser,
        });

        expect(mockRequestClient).toHaveBeenCalledWith(expectedBody);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');

        Date.now = originalNowFunc();
    });

    it('should throw an error when "APPLY_CASE_DEADLINE_EXTENSION" applied with lapsed deadline', async () => {
        const originalNowFunc = Date.now;
        Date.now = jest.fn(() =>
            new Date(Date.UTC(2021, 0, 11, 12)).valueOf());

        const testForm = {
            schema: {},
            data: {
                caseTypeActionUuid: '__uuid__',
                extendBy: 20,
                extendFrom: 'ANY',
                note: 'SOME NOTE'
            },
            action: actionTypes.APPLY_CASE_DEADLINE_EXTENSION,
            next: {
                action: 'CONFIRMATION_SUMMARY'
            }
        };

        await expect(actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            caseActionType: 'extension',
            context: null,
            form: testForm,
            user: mockUser,
        })).rejects.toThrow('Failed to perform action');

        Date.now = originalNowFunc;
    });

    it('should return a CONFIRMATION when ADD_CASE_APPEAL action succeeds', async () => {

        const mockCaseTypeActionUuid = '00000000-0000-0000-0000-000000000000';

        const testForm = {
            data: {
                caseTypeActionUuid: mockCaseTypeActionUuid,
                status: 'Pending',
                add_document: [
                    {
                        originalname: 'TEST_ORIGINAL_NAME',
                        key: 'TEST_KEY',
                    }
                ]
            },
            action: actionTypes.ADD_CASE_APPEAL,
            next: {
                action: 'CONFIRMATION_SUMMARY'
            },
            schema: {
                fields: [
                    {
                        'component': 'add-document',
                        'props': {
                            'name': 'add_document',
                            'label': 'Are there any documents to include?'
                        }
                    }
                ]
            }
        };

        const expectedBody = {
            actionType: 'APPEAL',
            caseTypeActionUuid: mockCaseTypeActionUuid,
            status: 'Pending',
        };

        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            caseActionType: 'extension',
            caseActionData: {
                APPEAL: [{
                    id: mockCaseTypeActionUuid,
                    typeData: [],
                    typeInfo: {
                        uuid: mockCaseTypeActionUuid,
                        props: '{}'
                    }
                }]
            },
            entity: null,
            context: null,
            form: testForm,
            user: mockUser
        });

        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(expectedBody);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return a CONFIRMATION when ADD_CASE_APPEAL with officer detail action succeeds', async () => {

        const mockCaseTypeActionUuid = '00000000-0000-0000-0000-000000000000';

        const testForm = {
            data: {
                caseTypeActionUuid: mockCaseTypeActionUuid,
                status: 'Pending',
                officer: '__officer_uuid__',
                directorate: 'SOME_DIRECTORATE',
                add_document: [
                    {
                        originalname: 'TEST_ORIGINAL_NAME',
                        key: 'TEST_KEY',
                    }
                ]
            },
            action: actionTypes.ADD_CASE_APPEAL,
            next: {
                action: 'CONFIRMATION_SUMMARY'
            },
            schema: {
                fields: [
                    {
                        'component': 'add-document',
                        'props': {
                            'name': 'add_document',
                            'label': 'Are there any documents to include?'
                        }
                    }
                ]
            }
        };

        const expectedBody = {
            actionType: 'APPEAL',
            caseTypeActionUuid: mockCaseTypeActionUuid,
            status: 'Pending',
            appealOfficerData: JSON.stringify({
                IROfficerName: '__officer_uuid__',
                IROfficerDirectorate: 'SOME_DIRECTORATE'
            })
        };

        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            caseActionType: 'appeal',
            caseActionData: {
                APPEAL: [{
                    id: mockCaseTypeActionUuid,
                    typeData: [],
                    typeInfo: {
                        uuid: mockCaseTypeActionUuid,
                        props: '{"appealOfficerData": {"officer": {"label": "Internal review officer name", "value": "IROfficerName", "choices": "S_FOI_KIMU_TEAM_MEMBERS"}, "directorate": {"label": "Internal review officer directorate", "value": "IROfficerDirectorate", "choices": "S_FOI_DIRECTORATES"}} }'
                    }
                }]
            },
            entity: null,
            context: null,
            form: testForm,
            user: mockUser
        });

        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(expectedBody);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });

    it('should return a CONFIRMATION when EDIT_CASE_APPEAL action succeeds', async () => {

        const mockCaseActionId = '__uuid__';
        const mockCaseTypeActionUuid = '00000000-0000-0000-0000-000000000000';

        const testForm = {
            data: {
                caseTypeActionUuid: mockCaseTypeActionUuid,
                status: 'Complete',
                dateSentRMS: '2021-10-26',
                outcome: 'TEST_OUTCOME',
                complexCase: 'Yes',
                note: 'TEST NOTE'
            },
            action: actionTypes.EDIT_CASE_APPEAL,
            next: {
                action: 'CONFIRMATION_SUMMARY'
            }
        };

        const expectedBody = {
            actionType: 'APPEAL',
            uuid: mockCaseActionId,
            caseTypeActionUuid: mockCaseTypeActionUuid,
            status: 'Complete',
            dateSentRMS: '2021-10-26',
            outcome: 'TEST_OUTCOME',
            complexCase: 'Yes',
            note: 'TEST NOTE'
        };

        const response = await actionService.performAction('CASE', {
            caseId: 1234,
            stageId: 5678,
            caseActionId: mockCaseActionId,
            caseActionType: 'APPEAL',
            caseActionData: {
                APPEAL: [{
                    id: mockCaseTypeActionUuid,
                    typeData: [],
                    typeInfo: {
                        uuid: mockCaseTypeActionUuid,
                        props: '{}'
                    }
                }]
            },
            entity: null,
            context: null,
            form: testForm,
            user: mockUser
        });

        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient).toHaveBeenCalledWith(expectedBody);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('confirmation');
    });


});
