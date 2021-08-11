import { ValidationError } from '../../models/error';

const { validators, validationMiddleware } = require('../validation.js');

jest.mock('../../config.js', () => {
    return {
        forContext: context => {
            switch (context) {
                case 'server':
                    return {
                        DOCUMENT_WHITELIST: ['validExtension'],
                        VALID_DAYS_RANGE: '180'
                    };
            }
        }
    };
});

describe('Validators', () => {

    describe('Required validator', () => {
        it('should reject an empty field', () => {
            expect(validators.required({})).not.toEqual(null);
        });
        it('should accept a filled field', () => {
            expect(validators.required({ value: 'data' })).toEqual(null);
        });
    });

    describe('Required array validator', () => {
        it('should reject an empty field', () => {
            expect(validators.requiredArray({})).not.toEqual(null);
        });
        it('should reject with value of undefined', () => {
            expect(validators.requiredArray({ value: undefined })).not.toEqual(null);
        });
        it('should reject with value that is not an array', () => {
            expect(validators.requiredArray({ value: 'test' })).not.toEqual(null);
        });
        it('should reject with value that is an empty array', () => {
            expect(validators.requiredArray({ value: '[]' })).not.toEqual(null);
        });
        it('should accept with value that is an array with atleast 1 item', () => {
            expect(validators.requiredArray({ value: '[1]' })).toEqual(null);
        });
    });

    describe('Alphanumeric validator', () => {
        it('should reject symbols', () => {
            expect(validators.alphanumeric({ label: 'test', value: '!@£$' })).toEqual('test must be alphanumeric');
        });
        it('should accept alpha only', () => {
            expect(validators.alphanumeric({ label: 'test', value: 'Data' })).toEqual(null);
        });
        it('should accept numeric only', () => {
            expect(validators.alphanumeric({ label: 'test', value: '1234' })).toEqual(null);
        });
        it('should accept alphanumeric', () => {
            expect(validators.alphanumeric({ label: 'test', value: 'l33T' })).toEqual(null);
        });
    });

    describe('Currency validator', () => {
        it('should reject symbols', () => {
            expect(validators.currency({ label: 'test', value: '!@£$' })).toEqual('test must be currency amount');
        });
        it('should reject alphanumeric', () => {
            expect(validators.currency({ label: 'test', value: 'a1b2' })).toEqual('test must be currency amount');
        });
        it('should reject zero decimal', () => {
            expect(validators.currency({ label: 'test', value: '1234.' })).toEqual('test must be currency amount');
        });
        it('should reject one decimal', () => {
            expect(validators.currency({ label: 'test', value: '1234.5' })).toEqual('test must be currency amount');
        });
        it('should reject three decimal', () => {
            expect(validators.currency({ label: 'test', value: '1234.567' })).toEqual('test must be currency amount');
        });
        it('should accept numeric only', () => {
            expect(validators.currency({ label: 'test', value: '1234' })).toEqual(null);
        });
        it('should accept double place', () => {
            expect(validators.currency({ label: 'test', value: '1234.56' })).toEqual(null);
        });
    });

    describe('Numeric validator', () => {
        it('should reject symbols', () => {
            expect(validators.numeric({ label: 'test', value: '!@£$' })).toEqual('test must be numeric');
        });
        it('should reject alpha', () => {
            expect(validators.numeric({ label: 'test', value: 'data' })).toEqual('test must be numeric');
        });
        it('should reject alphanumeric', () => {
            expect(validators.numeric({ label: 'test', value: 'a1b2' })).toEqual('test must be numeric');
        });
        it('should accept numeric only', () => {
            expect(validators.numeric({ label: 'test', value: '1234' })).toEqual(null);
        });
    });

    describe('Valid date validator', () => {
        it('should reject not-real dates', () => {
            expect(validators.isValidDate({ value: '2011-02-33' })).not.toEqual(null);
        });
        it('should reject things that aren\'t numbers', () => {
            expect(validators.isValidDate({ value: 'belgium' })).not.toEqual(null);
        });
        it('should accept a valid date', () => {
            expect(validators.required({ value: '2011-02-30' })).toEqual(null);
        });
        it('should reject a malformed date', () => {
            expect(validators.isValidDate({ value: '2011--01' })).not.toEqual(null);
        });
    });

    describe('Before today validator', () => {
        it('should accept a date in the past', () => {
            expect(validators.isBeforeToday('1970-01-01')).toEqual(null);
        });
        it('should reject a date in the future', () => {
            expect(validators.isBeforeToday({ value: '3000-01-01' })).not.toEqual(null);
        });
    });

    describe('After today validator', () => {
        it('should reject a date in the past', () => {
            expect(validators.isAfterToday({ value: '1970-01-01' })).not.toEqual(null);
        });
        it('should accept a date in the future', () => {
            expect(validators.isAfterToday({ value: '3000-01-01' })).toEqual(null);
        });
    });

    describe('Valid Date within range', () => {
        it('should reject a date outside day limit', () => {
            expect(validators.isValidWithinDate({ value: '2020-01-01' })).not.toEqual(null);
        });
        it('should accept a date within day limit', () => {
            expect(validators.isValidWithinDate({ value: new Date() })).toEqual(null);
        });
    });

    describe('Is valid day validator', () => {
        it('should accept a day value with single digit day', () => {
            expect(validators.isValidDay({ value: '2000-01-1' })).toEqual(null);
        });
        it('should accept a day value with single digit day and leading 0', () => {
            expect(validators.isValidDay({ value: '2000-01-01' })).toEqual(null);
        });
        it('should accept a day value with double digit day within 1-28', () => {
            expect(validators.isValidDay({ value: '2000-01-13' })).toEqual(null);
        });
        it('should accept a day value of 29 for february month on leap year', () => {
            expect(validators.isValidDay({ value: '2020-02-29' })).toEqual(null);
        });
        it('should accept a day value of 31 for December month', () => {
            expect(validators.isValidDay({ value: '2020-12-31' })).toEqual(null);
        });
        it('should accept a day value of 30 month other than February', () => {
            expect(validators.isValidDay({ value: '2020-09-30' })).toEqual(null);
        });

        it('should reject a day value over 31', () => {
            expect(validators.isValidDay({ value: '2000-01-32' })).not.toEqual(null);
        });
        it('should reject a day value below 1', () => {
            expect(validators.isValidDay({ value: '2000-01-0' })).not.toEqual(null);
        });
        it('should reject a day value above maximum day value for month', () => {
            expect(validators.isValidDay({ value: '2000-02-31' })).not.toEqual(null);
        });
        it('should reject a day value with 3 or more length', () => {
            expect(validators.isValidDay({ value: '2000-02-001' })).not.toEqual(null);
        });
        it('should reject a day value with multiple potential connotations', () => {
            /* A day value can hold multiple connotations whereby we cannot infer the
             * correct value. One example of this is '012', whereby the user could
             * mean 01 or 12 for the day. As such we reject these */
            expect(validators.isValidDay({ value: '2000-02-012' })).not.toEqual(null);
        });
        it('should reject a day value of 29 for February on non leap year', () => {
            expect(validators.isValidDay({ value: '2001-02-29' })).not.toEqual(null);
        });
    });

    describe('Is valid month day validator', () => {
        it('should accept a month value with single digit day', () => {
            expect(validators.isValidMonth({ value: '2000-1-01' })).toEqual(null);
        });
        it('should accept a month value with single digit month and leading 0', () => {
            expect(validators.isValidMonth({ value: '2000-01-01' })).toEqual(null);
        });
        it('should accept a month value with double digit month within 1-12', () => {
            expect(validators.isValidMonth({ value: '2000-07-01' })).toEqual(null);
        });

        it('should reject a month value over 12', () => {
            expect(validators.isValidMonth({ value: '2000-13-01' })).not.toEqual(null);
        });
        it('should reject a month value below 1', () => {
            expect(validators.isValidMonth({ value: '2000-00-01' })).not.toEqual(null);
        });
        it('should reject a month value with 3 or more length', () => {
            expect(validators.isValidMonth({ value: '2000-002-01' })).not.toEqual(null);
        });
        it('should reject a month value with multiple potential connotations', () => {
            expect(validators.isValidMonth({ value: '2000-012-01' })).not.toEqual(null);
        });
    });

    describe('File extension validator', () => {
        it('should reject an invalid file extension', () => {
            const testFiles = [
                { originalname: 'some-file.invalidExtension' }
            ];
            expect(validators.hasWhitelistedExtension({ value: testFiles })).not.toEqual(null);
        });
        it('should accept a valid file extension', () => {
            const testFiles = [
                { originalname: 'some-file.validExtension' }
            ];
            expect(validators.hasWhitelistedExtension({ value: testFiles })).toEqual(null);
        });
        it('should support multiple files', () => {
            const testFiles = [
                { originalname: 'some-file.validExtension' },
                { originalname: 'some-file.invalidExtension' }
            ];
            expect(validators.hasWhitelistedExtension({ value: testFiles })).not.toEqual(null);
        });
        it('should skip if no files passed', () => {
            const testFiles = [
            ];
            expect(validators.hasWhitelistedExtension(testFiles)).toEqual(null);
        });
    });

    describe('Case reference validation', () => {
        it('should accept regardless of case', () => {
            expect(validators.isValidCaseReference({ value: 'MiN/0000000/22' })).toEqual(null);
        });
        it('should accept spaces at the end', () => {
            expect(validators.isValidCaseReference({ value: 'MIN/0000000/22 ' })).toEqual(null); // one space at the end
            expect(validators.isValidCaseReference({ value: ' MIN/0000000/22' })).toEqual(null); // one space at the beginning
            expect(validators.isValidCaseReference({ value: 'MIN/0000000/22     ' })).toEqual(null); // multiple spaces at the end
            expect(validators.isValidCaseReference({ value: '     MIN/0000000/22' })).toEqual(null); // multiple spaces at the beginning
        });
        it('should reject if does not fit pattern', () => {
            expect(validators.isValidCaseReference({ value: 'M/0000000/22' })).not.toEqual(null); // To little letters at start
            expect(validators.isValidCaseReference({ value: 'MINTED/0000000/22' })).not.toEqual(null); // To many letters at start
            expect(validators.isValidCaseReference({ value: 'MiN/000000/22' })).not.toEqual(null); // To little numbers in middle
            expect(validators.isValidCaseReference({ value: 'MiN/00000000/22' })).not.toEqual(null); // To many numbers in middle
            expect(validators.isValidCaseReference({ value: 'MiN/000000/2' })).not.toEqual(null); // To little numbers in final section
            expect(validators.isValidCaseReference({ value: 'MiN/000000/222' })).not.toEqual(null); // To many numbers in final section
        });
        it('should reject if contains more than pattern', () => {
            expect(validators.isValidCaseReference({ value: 'MIN/0000000/22-' })).not.toEqual(null); // invalid char at the end
            expect(validators.isValidCaseReference({ value: '-MIN/0000000/22' })).not.toEqual(null); // invalid char at the beginning
        });
    });

    describe('Contributions fulfilled validation', () => {
        it('should reject with message if fails with message', () => {
            expect(validators.contributionsFulfilled({ value: '{ "test": 1 }', message: 'test' })).toEqual('test');
        });
        it('should reject if value passed in is null', () => {
            expect(validators.contributionsFulfilled({ value: null })).not.toEqual(null);
        });
        it('should reject if value passed in is undefined', () => {
            expect(validators.contributionsFulfilled({ value: undefined })).not.toEqual(null);
        });
        it('should reject if value passed in is not an array', () => {
            expect(validators.contributionsFulfilled({ value: '{ "test": 1 }' })).not.toEqual(null);
        });
        it('should reject if value does not have contributionStatus not present', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "test": 1 } }]' })).not.toEqual(null);
        });
        it('should reject if value has contributionStatus not cancelled or received', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "test" } }]' })).not.toEqual(null);
        });
        it('should reject if one value has contributionStatus that is not cancelled or received', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" }, { "contributionStatus": "test" } }]' })).not.toEqual(null);
        });
        it('should accept if value has contributionStatus as cancelled', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionCancelled" } }]' })).toEqual(null);
        });
        it('should accept if value has contributionStatus as received', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" } }]' })).toEqual(null);
        });
        it('should accept if all value has contributionStatus as received or cancelled', () => {
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" } }, { "data": {"contributionStatus": "contributionCancelled" } }]' })).toEqual(null);
        });
    });

    describe('Approvals fulfilled validation', () => {
        it('should reject with message if fails with message', () => {
            expect(validators.approvalsFulfilled({ value: '{ "test": 1 }', message: 'test' })).toEqual('test');
        });
        it('should reject if value passed in is null', () => {
            expect(validators.approvalsFulfilled({ value: null })).not.toEqual(null);
        });
        it('should reject if value passed in is undefined', () => {
            expect(validators.approvalsFulfilled({ value: undefined })).not.toEqual(null);
        });
        it('should reject if value passed in is not an array', () => {
            expect(validators.approvalsFulfilled({ value: '{ "test": 1 }' })).not.toEqual(null);
        });
        it('should reject if value does not have contributionStatus not present', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "test": 1 } }]' })).not.toEqual(null);
        });
        it('should reject if value has approvalStatus not cancelled or received', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "approvalStatus": "test" } }]' })).not.toEqual(null);
        });
        it('should reject if one value has contributionStatus that is not cancelled or received', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" }, { "contributionStatus": "test" } }]' })).not.toEqual(null);
        });
        it('should accept if value has contributionStatus as cancelled', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionCancelled" } }]' })).toEqual(null);
        });
        it('should accept if value has contributionStatus as received', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" } }]' })).toEqual(null);
        });
        it('should accept if all value has contributionStatus as received or cancelled', () => {
            expect(validators.approvalsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" } }, { "data": {"contributionStatus": "contributionCancelled" } }]' })).toEqual(null);
        });
    });

    describe('One of validation', () => {
        it('should reject if one of options are not fulfilled', () => {
            const options = [
                'delay',
                'comms'
            ];

            expect(validators.oneOf({ submittedFormData: { 'admin': 'admin', 'other': 'other' }, options: options, message: 'test error message' })).toEqual('test error message');
        });

        it('should accept if one of options are fulfilled', () => {
            const options = [
                'delay',
                'comms'
            ];

            expect(validators.oneOf({ submittedFormData: { 'delay': 'delay' }, options: options, message: 'test error message' })).toEqual(null);
        });
    });
});

describe('Validation middleware', () => {

    const res = {};
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
    });

    it('should validate fields', () => {
        const req = {
            form: {
                data: {
                    ['test-pass']: 'TEST',
                    ['test-fail']: null
                },
                schema: {
                    fields: [
                        { validation: ['required'], props: { name: 'test-pass', label: 'Test Pass' } },
                        { validation: ['required'], props: { name: 'test-fail', label: 'Test Fail' } }
                    ]
                }
            }
        };
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
    it('should validate fields within expandable checkbox', () => {
        const req = {
            form: {
                data: {
                    ['checkbox']: null,
                    ['test-pass']: 'TEST',
                    ['test-fail']: null
                },
                schema: {
                    fields: [
                        {
                            component: 'expandable-checkbox', validation: [], props: {
                                name: 'checkbox', label: '', items: [
                                    { validation: ['required'], props: { name: 'test-pass', label: 'Test Pass' } },
                                    { validation: ['required'], props: { name: 'test-fail', label: 'Test Fail' } }]
                            }
                        }
                    ]
                }
            }
        };
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
    it('should skip when no validation rules passed', () => {
        const req = {
            form: {
                data: {
                    ['test-pass']: 'TEST'
                },
                schema: {
                    fields: [
                        { props: { name: 'test-pass', label: 'Test Pass' } }
                    ]
                }
            }
        };
        validationMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
    });
    it('should create an error when validator does not exist', () => {
        const req = {
            form: {
                data: {
                    ['test-field']: 'TEST'
                },
                schema: {
                    fields: [
                        { validation: ['UNSUPPORTED_VALIDATOR'], props: { name: 'test-field', label: 'Test Field' } }
                    ]
                }
            }
        };
        validationMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
    it('should skip if no form present', () => {
        const req = {};
        validationMiddleware(req, res, next);
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should not validate hidden/removed fieldset', () => {
        const req = {
            form: {
                data: {
                    BusArea: 'TransferToOgd',
                    RefType: '',
                    Priority: '',
                    ChannelIn: 'Email'
                },
                schema: {
                    title: 'Some Title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        // this field will be hidden (see hideConditions) and therefore should not be validated,
                        // even though it has no value and validation: ['required'].
                        {
                            validation: ['required'],
                            props: {
                                hideConditions: [
                                    {
                                        conditionPropertyName: 'BusArea',
                                        conditionPropertyValue: 'TransferToOgd'
                                    },
                                ],
                                name: 'RefType',
                                label: 'RefType_label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                        {
                            validation: ['required'],
                            props: {
                                name: 'BusArea',
                                label: 'BusArea label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        }
                    ],
                    secondaryActions: [],
                }
            },
        };
        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ValidationError);
    });
    it('should validate shown/visible fieldset', () => {
        const req = {
            form: {
                data: {
                    BusArea: 'TransferToOther',
                    RefType: '',
                    Priority: '',
                    ChannelIn: 'Email'
                },
                schema: {
                    title: 'Some Title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        // This field will be hidden (see hideConditions) and therefore should not be validated,
                        // even though it has no value and validation: ['required'].
                        {
                            validation: ['required'],
                            props: {
                                hideConditions: [
                                    {
                                        conditionPropertyName: 'BusArea',
                                        conditionPropertyValue: 'TransferToOther'
                                    },
                                ],
                                name: 'RefType',
                                label: 'RefType_label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                        {
                            validation: ['required'],
                            props: {
                                name: 'BusArea',
                                label: 'BusArea label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                        // The below field does not have a hideCondition, therefore normal validation rules apply.
                        {
                            validation: ['required'],
                            props: {
                                name: 'Priority',
                                label: 'Priority label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        }
                    ],
                    secondaryActions: [],
                }
            },
        };
        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
        expect(next.mock.calls[0][0].status).toEqual(200);
        expect(next.mock.calls[0][0].fields.Priority).toEqual('Priority label is required');
    });
    it('should validate when both hideConditions & visibilityConditions have been defined', () => {
        const req = {
            form: {
                data: {
                    BusArea: 'TransferToOther',
                    RefType: '',
                    Priority: '',
                    ChannelIn: ''
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        // This field will be hidden (see hideConditions) and therefore should not be validated,
                        // even though it has no value and validation: ['required'].
                        {
                            validation: ['required'],
                            props: {
                                hideConditions: [
                                    {
                                        conditionPropertyName: 'BusArea',
                                        conditionPropertyValue: 'TransferToOther'
                                    },
                                ],
                                name: 'RefType',
                                label: 'RefType_label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                        {
                            validation: ['required'],
                            props: {
                                name: 'BusArea',
                                label: 'BusArea label',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                        // The below field will not be validated even though it's empty; this is because the visibility
                        // condition has not been met.
                        {
                            validation: ['required'],
                            props: {
                                name: 'Priority',
                                label: 'Priority label',
                                visibilityConditions: [
                                    {
                                        conditionPropertyName: 'ChannelIn',
                                        conditionPropertyValue: 'fax'
                                    },
                                ],
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        }
                    ],
                    secondaryActions: [],
                }
            },
        };
        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ValidationError);
    });
    it('should validate when visibilityConditions function has been specified', () => {
        const req = {
            form: {
                data: {
                    TestCheckbox: 'Test,Other'
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        {
                            validation: ['required'],
                            props: {
                                visibilityConditions: [
                                    {
                                        function: 'hasCommaSeparatedValue',
                                        conditionPropertyName: 'TestCheckbox',
                                        conditionPropertyValue: 'Other'
                                    },
                                ],
                                name: 'OtherFieldText',
                                label: 'Value',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                    ]
                }
            },
        };

        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
        expect(next.mock.calls[0][0].fields).toEqual({ OtherFieldText: 'Value is required' });
    });
    it('should not validate when visibilityConditions function has been specified but not satisfied', () => {
        const req = {
            form: {
                data: {
                    TestCheckbox: 'Test,Anything'
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        {
                            validation: ['required'],
                            props: {
                                visibilityConditions: [
                                    {
                                        function: 'hasCommaSeparatedValue',
                                        conditionPropertyName: 'TestCheckbox',
                                        conditionPropertyValue: 'Other'
                                    },
                                ],
                                name: 'OtherFieldText',
                                label: 'Value',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                    ]
                }
            },
        };

        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ValidationError);
    });
    it('should not validate when visibilityConditions function has been specified does not exist', () => {
        const req = {
            form: {
                data: {
                    TestCheckbox: 'Test,Other'
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        {
                            validation: ['required'],
                            props: {
                                visibilityConditions: [
                                    {
                                        function: 'testFunctionNotExist',
                                        conditionPropertyName: 'TestCheckbox',
                                        conditionPropertyValue: 'Other'
                                    },
                                ],
                                name: 'OtherFieldText',
                                label: 'Value',
                                sections: {},
                                items: {},
                            },
                            validationSuppressor: {}
                        },
                    ]
                }
            },
        };

        validationMiddleware(req, res, next);

        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(ValidationError);
    });
    it('should validate if radio button has conditionalContent', () => {
        const req = {
            form: {
                data: {
                    TestRadioField: 'TestRadioFieldValue',
                    RefType: '',
                    Priority: '',
                    ChannelIn: '',
                    TestRadioFieldValueText: ''
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        {
                            validation: ['required'],
                            component: 'radio',
                            props: {
                                hideConditions: [
                                    {
                                        conditionPropertyName: 'BusArea',
                                        conditionPropertyValue: 'TransferToOther'
                                    },
                                ],
                                name: 'TestRadioField',
                                label: 'TestRadioField_label',
                                choices: [
                                    { label: 'radio_1', value: 'radio1' },
                                    { label: 'radio_2', value: 'radio2' },
                                    {
                                        label: 'Test Field Label',
                                        value: 'TestRadioFieldValue',
                                        conditionalContent: { label: 'Further Details' }
                                    },
                                ],
                            },
                            validationSuppressor: {}
                        },
                    ],
                    secondaryActions: [],
                }
            },
        };
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
        expect(next.mock.calls[0][0].fields).toEqual({ TestRadioFieldValueText: 'Further Details is required' });
    });
    it('should validate radio button first if radio button has conditionalContent', () => {
        const req = {
            form: {
                data: {
                    TestEmptyRadioField: '',
                    RefType: '',
                    Priority: '',
                    ChannelIn: '',
                    TestEmptyRadioFieldValueText: ''
                },
                schema: {
                    title: 'Some title',
                    defaultActionLabel: 'Continue',
                    fields: [
                        {
                            validation: ['required'],
                            component: 'radio',
                            props: {
                                hideConditions: [
                                    {
                                        conditionPropertyName: 'BusArea',
                                        conditionPropertyValue: 'TransferToOther'
                                    },
                                ],
                                name: 'TestRadioField',
                                label: 'TestRadioField_label',
                                choices: [
                                    { label: 'radio_1', value: 'radio1' },
                                    { label: 'radio_2', value: 'radio2' },
                                    {
                                        label: 'Test Field Label',
                                        value: 'TestEmptyRadioFieldValue',
                                        conditionalContent: { label: 'Further Details' }
                                    },
                                ],
                            },
                            validationSuppressor: {}
                        },
                    ],
                    secondaryActions: [],
                }
            },
        };
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
        expect(next.mock.calls[0][0].fields).toEqual({ TestRadioField: 'TestRadioField_label is required' });
    });
    it('should not validate if visibilityConditions & hideConditions have not been met', () => {
        const req = setUpFormData('p1');
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
    });
    it('should validate if visibilityConditions have been met but hideConditions have not', () => {
        const req = setUpFormData('p10');
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
        expect(next.mock.calls[0][0].fields).toEqual({ 'RefTypeField': 'RefTypeField_label is required' });
    });
    it('should not validate if visibilityConditions have not been met but hideConditions have', () => {
        const req = setUpFormData('p5');
        validationMiddleware(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).not.toBeInstanceOf(Error);
    });
});

const setUpFormData = (priorityFieldValue) => {
    return {
        form: {
            data: {
                RefTypeField: '',
                PriorityField: priorityFieldValue,
                ChannelIn: '',
                SomeField: ''
            },
            schema: {
                title: 'Some title',
                defaultActionLabel: 'Continue',
                fields: [
                    {
                        validation: ['required'],
                        component: 'radio',
                        props: {
                            hideConditions: [
                                {
                                    conditionPropertyName: 'PriorityField',
                                    conditionPropertyValue: 'p5'
                                },
                            ],
                            visibilityConditions: [
                                {
                                    conditionPropertyName: 'PriorityField',
                                    conditionPropertyValue: 'p10'
                                },
                            ],
                            name: 'RefTypeField',
                            label: 'RefTypeField_label',
                            choices: [
                                { label: 'ref_1', value: 'r1' },
                                { label: 'ref_2', value: 'r2' },
                                {
                                    label: 'Test Field Label',
                                    value: 'TestEmptyRadioFieldValue',
                                    conditionalContent: { label: 'Further Details' }
                                },
                            ],
                        },
                        validationSuppressor: {}
                    },
                    {
                        validation: ['required'],
                        component: 'radio',
                        props: {
                            name: 'PriorityField',
                            label: 'PriorityField_label',
                            choices: [
                                { label: 'priority_1', value: 'p1' },
                                { label: 'priority_2', value: 'p2' },
                                {
                                    label: 'priority_3',
                                    value: 'p3',
                                    conditionalContent: { label: 'Further Details' }
                                },
                            ],
                        },
                        validationSuppressor: {}
                    }
                ],
                secondaryActions: [],
            }
        },
    };
};
