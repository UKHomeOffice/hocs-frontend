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
        const expectedOutputForm = {
            'data': {
                'KimuDateReceived': date
            },
            'meta': {},
            'schema': {
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
                        'props': {
                            'hint': 'For example, 30 01 2021',
                            'label': 'Date correspondence received in KIMU',
                            'name': 'KimuDateReceived'
                        },
                        'validation': [
                            {
                                'message': 'Date correspondence received in KIMU is required',
                                'type': 'required'
                            },
                            {
                                'message': 'Date correspondence received in KIMU must be a valid date',
                                'type': 'isValidDate'
                            },
                            {
                                'message': 'Date correspondence received in KIMU cannot be in the future',
                                'type': 'isBeforeToday'
                            }
                        ]
                    },
                    {
                        'component': 'radio',
                        'props': {
                            'choices': [
                                {
                                    'label': 'Email',
                                    'value': 'EMAIL'
                                },
                                {
                                    'label': 'Post',
                                    'value': 'POST'
                                }
                            ],
                            'label': 'How was the request received?',
                            'name': 'OriginalChannel'
                        },
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ]
                    },{
                        'component': 'dropdown',
                        'validation': [{
                            'type': 'required'
                        }],
                        'props': {
                            'choices': 'S_FOI_TYPES',
                            'label': 'FOI Type',
                            'name': 'FoiType'
                        }
                    }, {
                        'component': 'dropdown',
                        'validation': [{
                            'type': 'required'
                        }],
                        'props': {
                            'choices': 'TOPICS_FOI',
                            'defaultOptions': true,
                            'label': 'Case Topic',
                            'name': 'Topics'
                        }
                    },{
                        'component': 'text-area',
                        'props': {
                            'label': 'Request Question',
                            'name': 'RequestQuestion'
                        },
                        'validation': [
                            {
                                'type': 'required'
                            }
                        ]
                    }
                ],
                'showPrimaryAction': true,
                'title': 'Testing form'
            }
        };
        const inputKeys = {
            context: 'ACTION',
            workflow: 'CREATE',
            action: 'DOCUMENT',
            entity: 'FOI'
        };

        const outputForm = formDecorator(inputKeys, inputForm);

        expect(outputForm).toEqual(expectedOutputForm);
        expect(outputForm.schema.title).toBe(inputForm.schema.title);
        expect(outputForm.schema.fields[0]).toBe(inputForm.schema.fields[0]);

    });
});