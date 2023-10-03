/**
 * @jest-environment node
 */
/* eslint-disable no-undef */
const formDecorator = require('../form-decorator');

describe('Form schema decorations', function () {

    it('should throw Error when form to be decorated is malformed.', () => {
        const inputForm = {};
        const inputKeys = {};

        expect(() => formDecorator(inputKeys, inputForm)).toThrowError('Form for decoration missing or malformed.');
    });

    it('should throw Errow when no title exists in the schema', () => {
        const inputForm = {
            schema: {}
        };
        const inputKeys = {};

        expect(() => formDecorator(inputKeys, inputForm)).toThrowError('Form for decoration missing or malformed');
    });

    it('should return original form when no keys supplied', () => {
        const inputForm = {
            schema: {
                title: 'Testing form',
            }
        };
        const inputKeys = {};

        const outputForm = formDecorator(inputKeys, inputForm);

        expect(outputForm).toBe(inputForm);
    });

    it('should return original form when keys supplied are NOT {context, workflow, action, entity}', () => {
        const inputForm = {
            schema: {
                title: 'Testing form',
            }
        };
        const inputKeys = {
            context: 'test1',
            workflow: 'test1',
            someOtherKey: 'test1'
        };

        const outputForm = formDecorator(inputKeys, inputForm);

        expect(outputForm).toBe(inputForm);
    });

    it('should return original form when no decorations exist.', () => {
        const inputForm = {
            schema: {
                title: 'Testing form',
            }
        };
        const inputKeys = {
            context: 'ACTION',
            workflow: 'CREATE',
            action: 'DOCUMENT',
            entity: 'SOME_CASE_TYPE'
        };

        const outputForm = formDecorator(inputKeys, inputForm);

        expect(outputForm).toBe(inputForm);
    });

    it('should return decorated form when decorations exist.', () => {
        const date = new Date().toISOString().substr(0, 10);
        const inputForm = {
            schema: {
                title: 'Testing form',
                fields: [
                    {
                        'component': 'text-area',
                        'props': {
                            'label': 'Random Text Area',
                            'name': 'RequestTextArea'
                        },
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ]
                    }
                ]
            }
        };

        const inputKeys = {
            context: 'ACTION',
            workflow: 'CREATE',
            action: 'DOCUMENT',
            entity: 'FOI'
        };

        const outputForm = formDecorator(inputKeys, inputForm);

        const expectedOutputForm = {
            'schema': {
                'title': 'Testing form',
                'defaultActionLabel': 'Submit',
                'fields': [
                    {
                        'component': 'text-area',
                        'props': {
                            'label': 'Random Text Area',
                            'name': 'RequestTextArea'
                        },
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ]
                    },
                    {
                        'component': 'date',
                        'validation': [
                            {
                                'type': 'required',
                                'message': 'Date correspondence received in KIMU is required'
                            },
                            {
                                'type': 'isValidDate',
                                'message': 'Date correspondence received in KIMU must be a valid date'
                            },
                            {
                                'type': 'isBeforeToday',
                                'message': 'Date correspondence received in KIMU cannot be in the future'
                            }
                        ],
                        'props': {
                            'name': 'KimuDateReceived',
                            'label': 'Date correspondence received in KIMU',
                            'hint': 'For example, 30 01 2021'
                        }
                    },
                    {
                        'component': 'radio',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'OriginalChannel',
                            'label': 'How was the request received?',
                            'choices': [
                                {
                                    'label': 'Email',
                                    'value': 'EMAIL'
                                },
                                {
                                    'label': 'Post',
                                    'value': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'heading',
                        'validation': [],
                        'props': {
                            'name': 'case-view-heading',
                            'label': 'Correspondent Details',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                },
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Fullname',
                            'label': 'Full Name',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                },
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [],
                        'props': {
                            'name': 'Organisation',
                            'label': 'Organisation (Optional)',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                },
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Address1',
                            'label': 'Address line 1',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Address2',
                            'label': 'Address line 2',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Address3',
                            'label': 'Town or City',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Postcode',
                            'label': 'Postcode',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'dropdown',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Country',
                            'label': 'Country',
                            'choices': 'COUNTRIES_CURRENT',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                },
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Email',
                            'label': 'Email Address',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [],
                        'props': {
                            'name': 'Email',
                            'label': 'Email Address (Optional)',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'text',
                        'validation': [],
                        'props': {
                            'name': 'Reference',
                            'label': 'Requester\'s Reference (Optional)',
                            'visibilityConditions': [
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'EMAIL'
                                },
                                {
                                    'conditionPropertyName': 'OriginalChannel',
                                    'conditionPropertyValue': 'POST'
                                }
                            ]
                        }
                    },
                    {
                        'component': 'type-ahead',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'Topics',
                            'label': 'Case Topic',
                            'choices': 'TOPICS_FOI',
                            'defaultOptions': true
                        }
                    },
                    {
                        'component': 'text-area',
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ],
                        'props': {
                            'name': 'RequestQuestion',
                            'label': 'Request Question'
                        }
                    }
                ],
                'showPrimaryAction': true
            },
            'data': {
                'KimuDateReceived': date
            },
            'meta': {}
        };

        expect(outputForm).toEqual(expectedOutputForm);
        expect(outputForm.schema.title).toBe(inputForm.schema.title);
        expect(outputForm.schema.fields[0]).toBe(inputForm.schema.fields[0]);

    });
});
