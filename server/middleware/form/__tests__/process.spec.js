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
                            validation: [],
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

    it('should throw error if field validation fails', () => {
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
        expect(req.form.data).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should return data if form validation succeeds', () => {
        const req = {
            body: {
                ['test-field']: 'test'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            props: {
                                name: 'test-field',
                            }
                        }
                    ],
                    validation: [{
                        options: ['test-field'],
                        validator: 'oneOf'
                    }]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toEqual({ 'test-field': 'test' });
        expect(next).toHaveBeenCalled();
    });

    it('should throw error if form validation fails', () => {
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
                            props: {
                                name: 'test-field',
                            }
                        }
                    ],
                    validation: [{
                        options: ['test-field'],
                        validator: 'oneOf'
                    }]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should return data if validation condition met and form validation succeeds', () => {
        const req = {
            body: {
                ['test-field']: 'test',
                field: 'value'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            props: {
                                name: 'test-field',
                            }
                        }
                    ],
                    validation: [{
                        condition: {
                            fieldName: 'field',
                            value: 'value'
                        },
                        options: ['test-field'],
                        validator: 'oneOf'
                    }]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toEqual({ 'test-field': 'test' });
        expect(next).toHaveBeenCalled();
    });

    it('should throw error if validation condition met and form validation fails', () => {
        const req = {
            body: {
                ['test-field']: '',
                field: 'value'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            props: {
                                name: 'test-field',
                            }
                        }
                    ],
                    validation: [{
                        condition: {
                            fieldName: 'field',
                            value: 'value'
                        },
                        options: ['test-field'],
                        validator: 'oneOf'
                    }]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should return data if validation condition not met', () => {
        const req = {
            body: {
                ['test-field']: '',
                field: ''
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'text',
                            props: {
                                name: 'test-field',
                            }
                        }
                    ],
                    validation: [{
                        condition: {
                            fieldName: 'field',
                            value: 'value'
                        },
                        options: ['test-field'],
                        validator: 'oneOf'
                    }]
                }
            }
        };
        const res = {};

        processMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(req.form.data).toEqual({ 'test-field': '' });
        expect(next).toHaveBeenCalled();
    });

    it('should return data for fields with blank values without validation', () => {
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
                            validation: [],
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
        expect(req.form.data).toBeUndefined();
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

    it('should return sanitised day and month on change', () => {
        const req = {
            body: {
                ['test-field']: '1989-004-003'
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

    it('should not sanitise day and month with multiple connotations', () => {
        const req = {
            body: {
                ['test-field']: '1989-012-023'
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
        expect(req.form.data['test-field']).toEqual('1989-012-023');
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return sanitised year on change', () => {
        const req = {
            body: {
                ['test-field-1']: '0000-01-01',
                ['test-field-2']: '00002021-01-01',
                ['test-field-3']: '002000-01-01',
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
                                name: 'test-field-1',
                            }
                        },
                        {
                            component: 'date',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field-2',
                            }
                        },
                        {
                            component: 'date',
                            validation: [
                                'required'
                            ],
                            props: {
                                name: 'test-field-3',
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
        expect(req.form.data['test-field-1']).toEqual('-01-01');
        expect(req.form.data['test-field-2']).toEqual('2021-01-01');
        expect(req.form.data['test-field-3']).toEqual('2000-01-01');
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

    it('should process checkbox data as separate values', () => {
        const req = {
            body: {
                ['choiceOne']: 'A',
                ['choiceTwo']: 'B',
                ['choiceThree']: 'C',
                ['test-field']: ''
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'checkbox',
                            props: {
                                name: 'test-field',
                                choices: [
                                    { label: 'A', value: 'A', name: 'choiceOne' },
                                    { label: 'A', value: 'A', name: 'choiceTwo' },
                                    { label: 'A', value: 'A', name: 'choiceThree' }
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
        expect(req.form.data['choiceOne']).toBeDefined();
        expect(req.form.data['choiceTwo']).toBeDefined();
        expect(req.form.data['choiceThree']).toBeDefined();
        expect(req.form.data['choiceOne']).toEqual('A');
        expect(req.form.data['choiceTwo']).toEqual('B');
        expect(req.form.data['choiceThree']).toEqual('C');
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
                            validation: [],
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
                            validation: [],
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
    it('should process conditional radio data when conditional radio data exists', () => {
        const req = {
            body: {
                CurrentStage: 'MPAM_CREATION',
                DateReceived: '2020-12-04',
                testField: 'SomeRadioValue',
                SomeRadioValueText: 'some_text_related_to_radio'
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'radio',
                            validation: ['required'],
                            props: {
                                name: 'testField',
                                label: 'test-field-label',
                                choices: [
                                    { label: 'radio_1', value: 'radio1' },
                                    { label: 'radio_2', value: 'radio2' },
                                    {
                                        label: 'Test Field Label',
                                        value: 'SomeRadioValue',
                                        conditionalContent: { label: 'Further Details' }
                                    },
                                ]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};
        processMiddleware(req, res, next);
        expect(req.form.data).toEqual({ testField: 'SomeRadioValue', SomeRadioValueText: 'some_text_related_to_radio' });
    });
    it('should not process conditional radio data when conditional radio data does not exist', () => {
        const req = {
            body: {
                CurrentStage: 'MPAM_CREATION',
                DateReceived: '2020-12-04',
                testField: 'SomeRadioValue',
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'radio',
                            validation: ['required'],
                            props: {
                                name: 'testField',
                                label: 'test-field-label',
                                choices: [
                                    { label: 'radio_1', value: 'radio1' },
                                    { label: 'radio_2', value: 'radio2' },
                                    {
                                        label: 'Test Field Label',
                                        value: 'SomeRadioValue',
                                    },
                                ]
                            }
                        }
                    ]
                }
            }
        };
        const res = {};
        processMiddleware(req, res, next);
        expect(req.form.data).toEqual({ testField: 'SomeRadioValue' });
    });

    describe('when show/hide visibility props are passed through', () => {
        it('should not process fields that are not visible with visibility function', () => {
            const req = {
                body: {
                    'TestField1': 'Test',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'checkbox',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1',
                                    choices: [
                                        { label: 'A', value: 'Test' }
                                    ]
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    visibilityConditions: [{
                                        function: 'hasCommaSeparatedValue',
                                        conditionArgs: [
                                            {
                                                conditionPropertyName: 'TestField1',
                                                conditionPropertyValue: 'Other'
                                            }]
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'Test' });
        });
        it('should process fields that are visible with visibility function', () => {
            const req = {
                body: {
                    'TestField1': 'Test,Other',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'checkbox',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1',
                                    choices: [
                                        { label: 'A', value: 'Test' }
                                    ]
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    visibilityConditions: [{
                                        function: 'hasCommaSeparatedValue',
                                        conditionArgs: [
                                            {
                                                conditionPropertyName: 'TestField1',
                                                conditionPropertyValue: 'Other'
                                            }
                                        ]
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'Test,Other', TestField2: 'Blah' });
        });
        it('should process fields that are visible with visibility property condition', () => {
            const req = {
                body: {
                    'TestField1': 'Other',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1'
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    visibilityConditions: [{
                                        conditionPropertyName: 'TestField1',
                                        conditionPropertyValue: 'Other'
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'Other', TestField2: 'Blah' });
        });
        it('should process fields with visibility property condition outside of form data', () => {
            const req = {
                body: {
                    'TestField1': 'Other',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    visibilityConditions: [{
                                        conditionPropertyName: 'TestField1',
                                        conditionPropertyValue: 'Other'
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField2: 'Blah' });
        });
        it('should not process fields that are not visible with visibility property condition', () => {
            const req = {
                body: {
                    'TestField1': 'OtherTEST',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1'
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    visibilityConditions: [{
                                        conditionPropertyName: 'TestField1',
                                        conditionPropertyValue: 'Other'
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'OtherTEST' });
        });
        it('should not process fields that are not visible with hide property condition', () => {
            const req = {
                body: {
                    'TestField1': 'Other',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1'
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    hideConditions: [{
                                        conditionPropertyName: 'TestField1',
                                        conditionPropertyValue: 'Other'
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'Other' });
        });
        it('should not process fields that are visible with hide property condition', () => {
            const req = {
                body: {
                    'TestField1': 'Other',
                    'TestField2': 'Blah',
                },
                query: {},
                form: {
                    schema: {
                        fields: [
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField1',
                                    label: 'Test Field 1'
                                }
                            },
                            {
                                component: 'text-area',
                                validation: ['required'],
                                props: {
                                    name: 'TestField2',
                                    label: 'Test Field 2',
                                    hideConditions: [{
                                        conditionPropertyName: 'TestField1',
                                        conditionPropertyValue: 'OtherTest'
                                    }]
                                }
                            }
                        ]
                    }
                }
            };
            const res = {};
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField1: 'Other', TestField2: 'Blah' });
        });
    });

    describe('when passed fields that should not be processed', () => {
        const req = {
            body: {
                'TestSomuList': '1',
                'TestDisplay': '2',
                'TestField': '3',
            },
            query: {},
            form: {
                schema: {
                    fields: [
                        {
                            component: 'display',
                            validation: [],
                            props: {
                                name: 'TestDisplay',
                                label: 'Test Field 1'
                            }
                        },
                        {
                            component: 'somu-list',
                            validation: ['required'],
                            props: {
                                name: 'TestSomuList',
                                label: 'Test Field 2'
                            }
                        },
                        {
                            component: 'text-area',
                            validation: ['required'],
                            props: {
                                name: 'TestField',
                                label: 'Test Field 3'
                            }
                        }
                    ]
                }
            }
        };
        const res = {};

        it('should remove fields from response', () => {
            processMiddleware(req, res, next);
            expect(req.form.data).toEqual({ TestField: '3' });
        });
    });

});
