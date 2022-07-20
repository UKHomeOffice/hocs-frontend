jest.mock('../forms/index.js', () => ({
    getForm: jest.fn(),
    getFormForCase: jest.fn()
}));

jest.mock('../../clients', () => ({
    workflowService: {
        get: jest.fn(() => Promise.resolve().catch((error) => {}))
    }
}));

jest.mock('../list/service', () => ({
    getInstance: function () {
        return {
            fetch: function () {
                return mockActionForm;
            }
        };
    }
}));

const mockActionForm = {
    schema: {
        fields: []
    }
};

describe('getFormForAction', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                workflow: 'WORKFLOW',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            return mockActionForm;
        });
        const { getFormForAction } = require('../form');
        await getFormForAction(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].workflow).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].user.id).toEqual('test');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an instance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                workflow: 'WORKFLOW',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            throw new Error('SOMETHING_WENT_WRONG');
        });
        const { getFormForAction } = require('../form');
        await getFormForAction(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].workflow).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].user.id).toEqual('test');
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});

describe('getFormForCase', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                entity: 'ENTITY',
                context: 'CONTEXT',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getFormForCase.mockImplementation(() => {
            return mockActionForm;
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getFormForCase).toHaveBeenCalled();
        expect(formRepository.getFormForCase).toHaveBeenCalledTimes(1);
        expect(formRepository.getFormForCase.mock.calls[0][0].entity).toEqual('ENTITY');
        expect(formRepository.getFormForCase.mock.calls[0][0].context).toEqual('CONTEXT');
        expect(formRepository.getFormForCase.mock.calls[0][0].action).toEqual('ACTION');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                entity: 'ENTITY',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getFormForCase.mockImplementation(() => {
            throw new Error('SOMETHING_WENT_WRONG');
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getFormForCase).toHaveBeenCalled();
        expect(formRepository.getFormForCase).toHaveBeenCalledTimes(1);
        expect(formRepository.getFormForCase.mock.calls[0][0].entity).toEqual('ENTITY');
        expect(formRepository.getFormForCase.mock.calls[0][0].action).toEqual('ACTION');
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});

describe('getFormForStage', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const { workflowService } = require('../../clients');
        workflowService.get.mockImplementation(() => Promise.resolve({ data: { form: mockActionForm } }).catch((error) => {}));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should return form correct form object if repository returns null form', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };

        const { workflowService } = require('../../clients');
        workflowService.get.mockImplementation(() => Promise.resolve({ data: { form: null } }).catch((error) => {}));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);

        expect(req.form.schema).toEqual({ fields: [] });
        expect(req.form).toEqual(mockActionForm);
        expect(next).toHaveBeenCalled();
    });

    it('should add an instance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const { workflowService } = require('../../clients');
        workflowService.get.mockImplementation(() => Promise.reject({ stack: 'ERR_STACK', response: { status: 500 } }).catch((error) => {}));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});

describe('when the hydrate method is called', () => {
    const { hydrateFields } = require('../form');
    const { FormServiceError, AuthenticationError } = require('../../models/error');
    const items = ['item1', 'item2', 'item3'];

    describe('and the schema has a flat array of fields ', () => {
        const items = ['item1', 'item2', 'item3'];
        const req = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            choices: 'CHOICES_LIST'
                        }
                    }, {
                        props: {
                            items: 'ITEMS_LIST'
                        }
                    }]
                }
            },
            listService: {
                fetch: () => Promise.resolve(items).catch((error) => {})
            }
        };
        const next = jest.fn();

        it('should hydrate the items', async () => {
            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(req.form.schema.fields[0].props.choices).toEqual(items);
            expect(req.form.schema.fields[1].props.items).toEqual(items);
        });
    });
    describe('and the list fetch request fails with a 401', () => {
        const req = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            choices: 'CHOICES_LIST'
                        }
                    }, {
                        props: {
                            items: 'ITEMS_LIST'
                        }
                    }]
                }
            },
            listService: {
                fetch: () => Promise.reject({
                    response: {
                        status: 401
                    }
                }).catch((error) => {})
            }
        };
        const next = jest.fn();

        it('should call next with a permission error', async () => {
            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalledWith(new AuthenticationError('You are not authorised to work on this case'));
        });
    });
    describe('and the list fetch request fails with a PermissionError', () => {
        const req = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            choices: 'CHOICES_LIST'
                        }
                    }, {
                        props: {
                            items: 'ITEMS_LIST'
                        }
                    }]
                }
            },
            listService: {
                fetch: () => Promise.reject(new AuthenticationError('PermissionError')).catch((error) => {})
            }
        };
        const next = jest.fn();

        it('should call next with a permission error', async () => {
            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalledWith(new AuthenticationError('PermissionError'));
        });
    });
    describe('and the list fetch request fails with some other error', () => {
        const req = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            choices: 'CHOICES_LIST'
                        }
                    }, {
                        props: {
                            items: 'ITEMS_LIST'
                        }
                    }]
                }
            },
            listService: {
                fetch: () => Promise.reject({
                    response: {
                        status: 404
                    }
                }).catch((error) => {})
            }
        };
        const next = jest.fn();

        it('should call next with a permission error', async () => {
            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalledWith(new FormServiceError('Failed to fetch form'));
        });
    });
    describe('and the schema has sections containing items', () => {
        const req = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            sections: [{
                                items: [{
                                    props: {
                                        choices: 'CHOICES_LIST'
                                    }
                                }, {
                                    props: {
                                        items: 'ITEMS_LIST'
                                    }
                                }]
                            }]
                        }
                    }],
                }
            },
            listService: {
                fetch: () => Promise.resolve(items).catch((error) => {})
            }
        };
        const next = jest.fn();

        it('should hydrate the items', async () => {
            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(req.form.schema.fields[0].props.sections[0].items[0].props.choices).toEqual(items);
            expect(req.form.schema.fields[0].props.sections[0].items[1].props.items).toEqual(items);
        });
    });

    describe('and the schema has populated somu type and somu item containing items', () => {
        const somuType = {
            uuid: '00000000-0000-0000-0000-000000000000',
            caseType: 'TESTCASETYPE',
            type: 'TEST',
            active: true
        };

        const somuItems = {
            uuid: '00000000-0000-0000-0000-000000000000',
            data: '{}',
            deleted: true
        };

        const choices = [{
            'value':'Value',
            'label':'Label'
        }];

        const formSchema = {
            form: {
                schema: {
                    fields: [{
                        props: {
                            somuType: {
                                caseType: 'TESTCASETYPE',
                                type: 'TEST',
                                choices: 'TESTCHOICES'
                            }
                        }
                    }],
                }
            }
        };
        const next = jest.fn();

        it('should hydrate the items', async () => {
            const req = { ...formSchema, listService: {
                getFromStaticList: () => Promise.resolve(somuType).catch((error) => {}),
                fetch: jest.fn(async (list, _) => {
                    if (list === 'TESTCHOICES') {
                        return Promise.resolve(choices).catch((error) => {});
                    } else {
                        return Promise.resolve(somuItems).catch((error) => {});
                    }
                })
            } };

            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(req.form.schema.fields[0].props.choices).toEqual(choices);
            expect(req.form.schema.fields[0].props.somuType).toEqual(somuType);
            expect(req.form.schema.fields[0].props.somuItems).toEqual(somuItems);
        });

        it('should call next with error if somu type cannot be retrieved', async () => {
            const req = { ...formSchema, listService: {
                getFromStaticList: () => Promise.reject({
                    response: {
                        status: 404
                    }
                }).catch((error) => {}),
                fetch: jest.fn(async (list, _) => {
                    if (list === 'TESTCHOICES') {
                        return Promise.resolve(choices);
                    } else {
                        return Promise.resolve(somuItems);
                    }
                })
            } };

            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new FormServiceError('Failed to fetch form'));
        });

        it('should call next with error if choices cannot be retrieved', async () => {
            const req = { ...formSchema, listService: {
                getFromStaticList: () => Promise.resolve(somuType),
                fetch: jest.fn(async (list, _) => {
                    if (list === 'TESTCHOICES') {
                        return Promise.reject({ response: { status: 404 } });
                    } else {
                        return Promise.resolve(somuItems);
                    }
                })
            } };

            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new FormServiceError('Failed to fetch form'));
        });

        it('should call next with error if somu items cannot be retrieved', async () => {
            const req = { ...formSchema, listService: {
                getFromStaticList: () => Promise.resolve(somuType),
                fetch: jest.fn(async (list, _) => {
                    if (list === 'TESTCHOICES') {
                        return Promise.resolve(choices);
                    } else {
                        return Promise.reject({ response: { status: 404 } });
                    }
                })
            } };

            await hydrateFields(req, null, next);

            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new FormServiceError('Failed to fetch form'));
        });
    });
});
