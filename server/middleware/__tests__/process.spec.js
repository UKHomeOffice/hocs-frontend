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

    it('return not return data for fields without values', () => {
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

    it('should return dates as a string when passed', () => {
        const req = {
            body: {
                ['test-field-year']: '1989',
                ['test-field-month']: '01',
                ['test-field-day']: '19',
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
                ['test-field-year']: '1989',
                ['test-field-month']: '01'
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
        expect(Array.isArray(req.form.data['test-field'])).toEqual(true);
        expect(req.form.data['test-field'].length).toEqual(1);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
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
});