import { processMiddleware } from '../process';

describe('Process middleware', () => {

    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
    });

    it('should process form data when passed', () => {
        const req = {
            body: {
                ['test-field']: 'TEST_VALUE'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(req.form.data['test-field']).toEqual('TEST_VALUE');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should not return data for fields without values', () => {
        const req = {
            body: {},
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return data for fields with blank values', () => {
        const req = {
            body: {
                ['test-field']: ''
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toEqual('');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return dates as a string when passed', () => {
        const req = {
            body: {
                ['test-field']: '1989-01-19'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'date',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(req.form.data['test-field']).toEqual('1989-01-19');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return no values for fields with incomplete dates', () => {
        const req = {
            body: {
                ['test-field']: '1989-01-'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'date',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should pad single digit day and months with zeros', () => {
        const req = {
            body: {
                ['test-field']: '1989-04-03'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'date',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toEqual('1989-04-03');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should process checkbox data passed as an array', () => {
        const req = {
            body: {
                ['test-field']: ['A', 'C']
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'checkbox',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                                choices: [
                                    { label: 'A', value: 'A' },
                                    { label: 'B', value: 'B' }
                                ]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(Array.isArray(req.form.data['test-field'])).toBeTruthy();
        expect(req.form.data['test-field'].length).toEqual(2);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should process checkbox data passed as a string', () => {
        const req = {
            body: {
                ['test-field']: 'A'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'checkbox',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                                choices: [
                                    { label: 'A', value: 'A' }
                                ]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(req.form.data['test-field']).toEqual('A');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    describe('when empty checkbox data is passed', () => {
        const req = {
            body: {
                ['test-field']: ''
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'checkbox',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field',
                                choices: [
                                    { label: 'A', value: 'A' }
                                ]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        it('should save empty strings when passed as a string', () => {
            processMiddleware(req, res, next);
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
            expect(req.form.data['test-field']).toBeDefined();
            expect(req.form.data['test-field']).toEqual('');
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    it('should process files when passed and attach to field', () => {
        const req = {
            body: {},
            files: [
                { fieldname: 'test-field', value: 'A' },
                { fieldname: 'other-field', value: 'B' }
            ],
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'add-document',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field'
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(req.form.data['test-field'].filter(({ value }) => value === 'A').length).toEqual(1);
        expect(req.form.data['test-field'].filter(({ value }) => value === 'B').length).toEqual(0);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should process files when passed and return null for fields where no file is present', () => {
        const req = {
            body: {},
            files: [
            ],
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'add-document',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field'
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeDefined();
        expect(req.form.data['test-field']).toBeDefined();
        expect(req.form.data['test-field']).toBeNull();
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    describe('when expandable-checkbox data is processed', () => {
        const req = {
            body: {
                ['test-field-1']: 'TEST_VALUE_1',
                ['test-field-2']: 'TEST_VALUE_2',
                ['test-field-3']: 'TEST_VALUE_3'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'expandable-checkbox',
                            props: {
                                name: 'test-field-1',
                                items: [{
                                    component: 'text',
                                    props: {
                                        name: 'test-field-2'
                                    }
                                }, {
                                    component: 'text',
                                    props: {
                                        name: 'test-field-3'
                                    }
                                }]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};
        it('should save the value', () => {
            processMiddleware(req, res, next);
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
            expect(req.form.data['test-field-1']).toEqual('TEST_VALUE_1');
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
        });
        it('should save the child values', () => {
            processMiddleware(req, res, next);
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
            expect(req.form.data['test-field-2']).toEqual('TEST_VALUE_2');
            expect(req.form.data['test-field-3']).toEqual('TEST_VALUE_3');
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
    describe('when accordion data is processed', () => {
        const req = {
            body: {
                ['test-field-1']: 'TEST_VALUE_1',
                ['test-field-2']: 'TEST_VALUE_2',
                ['test-field-3']: 'TEST_VALUE_3'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'accordion',
                            props: {
                                name: 'test-field-1',
                                sections: [{
                                    items: [{
                                        component: 'text',
                                        props: {
                                            name: 'test-field-2'
                                        }
                                    }, {
                                        component: 'text',
                                        props: {
                                            name: 'test-field-3'
                                        }
                                    }]
                                }]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};
        it('should save the child values', () => {
            processMiddleware(req, res, next);
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
            expect(req.form.data['test-field-2']).toEqual('TEST_VALUE_2');
            expect(req.form.data['test-field-3']).toEqual('TEST_VALUE_3');
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});
