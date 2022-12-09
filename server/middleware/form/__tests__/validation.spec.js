import { FormSubmissionError, ValidationError } from '../../../models/error';
import { validateForm, validators } from '../validation';

jest.mock('../../../config.js', () => {
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

    describe('requiredIfValueSet validator', () => {
        it('should reject an empty field if the conditionPropertyValue is matched ', () => {
            expect(validators.requiredIfValueSet({
                value: undefined,
                props: {
                    conditionPropertyName: 'testProp',
                    conditionPropertyValue: 'testVal'
                },
                data: {
                    testProp: 'testVal'
                }
            }
            )
            ).not.toEqual(null);
        });
        it('should accept a filled field if the conditionPropertyValue is matched', () => {
            expect(validators.requiredIfValueSet({
                value: 'a value',
                props: {
                    conditionPropertyName: 'testProp',
                    conditionPropertyValue: 'testVal'
                },
                data: {
                    testProp: 'testVal'
                }
            })).toEqual(null);
        });
        it('should accept an empty field if the conditionPropertyValue is not matched ', () => {
            expect(validators.requiredIfValueSet({
                value: undefined,
                props: {
                    conditionPropertyName: 'testProp',
                    conditionPropertyValue: 'testVal'
                },
                data: {
                    testProp: 'non matching value'
                }
            }
            )
            ).toEqual(null);
        });
        it('should accept a filled field if the conditionPropertyValue is not matched', () => {
            expect(validators.requiredIfValueSet({
                value: 'a value',
                props: {
                    conditionPropertyName: 'testProp',
                    conditionPropertyValue: 'testVal'
                },
                data: {
                    testProp: 'non matching value'
                }
            })).toEqual(null);
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

    describe('Strict currency validator', () => {
        it('should reject symbols', () => {
            expect(validators.strictCurrency({ label: 'test', value: '!@£$' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should reject alphanumeric', () => {
            expect(validators.strictCurrency({ label: 'test', value: 'a1b2' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should reject zero decimal', () => {
            expect(validators.strictCurrency({ label: 'test', value: '1234.' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should reject one decimal', () => {
            expect(validators.strictCurrency({ label: 'test', value: '1234.5' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should reject three decimal', () => {
            expect(validators.strictCurrency({ label: 'test', value: '1234.567' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should reject numeric only', () => {
            expect(validators.strictCurrency({ label: 'test', value: '1234' })).toEqual('test must be a currency amount to 2 decimal places');
        });
        it('should accept double place', () => {
            expect(validators.strictCurrency({ label: 'test', value: '1234.56' })).toEqual(null);
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
        it('should reject if value passed in is invalid JSON', () => {
            expect(validators.contributionsFulfilled({ value: '{ "test": 1' })).not.toEqual(null);
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
            expect(validators.contributionsFulfilled({ value: '[{ "data": { "contributionStatus": "contributionReceived" } }, { "data": { "contributionStatus": "test" } }]' })).not.toEqual(null);
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


        const demoData = [{
            data: {
                approvalRequestStatus: 'approvalRequestCancelled',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestForBusinessUnit: 'FOI_APPROVER_SCS',
                approvalRequestCancellationNote: 'Test note'
            }
        }, {
            data: {
                approvalRequestStatus: 'approvalRequestResponseReceived',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestDecision: 'approved',
                approvalRequestResponseBy: 'Something',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestResponseNote: 'dcadcadf',
                approvalRequestForBusinessUnit: 'FOI_APPROVER_SCS',
                approvalRequestResponseReceivedDate: '2021-08-31'
            }
        },{
            data: {
                approvalRequestStatus: 'approvalRequestResponseReceived',
                approvalRequestDueDate: '2021-09-01',
                approvalRequestDecision: 'rejected',
                approvalRequestResponseBy: 'Something',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestResponseNote: 'dcadcadf',
                approvalRequestForBusinessUnit: 'FOI_APPROVER_SCS',
                approvalRequestResponseReceivedDate: '2021-08-31'
            }
        }, {
            data: {
                approvalRequestDueDate: '2021-09-01',
                approvalRequestCreatedDate: '2021-08-31',
                approvalRequestForBusinessUnit: 'FOI_APPROVER_SCS'
            }
        }, {
            data: {
                approvalRequestForBusinessUnit: 'FOI_APPROVER_SCS'
            }
        }];

        it('should throw error if object passed in NOT valid JSON', () => {
            // GIVEN
            const unexpectedObject = '"test": 1';
            const expectedError = new Error('Value passed for validation is not a valid Approval Request object.');

            // THEN
            expect(() => validators.approvalsFulfilled({ value: unexpectedObject })).toThrowError(expectedError);
        });


        it('should throw error if object passed is not an array.', () => {
            // GIVEN
            const unexpectedObject = '{ "test": 1 }';
            const expectedError = new Error('Value passed for validation is not a valid Approval Request object.');

            // THEN
            expect(() => validators.approvalsFulfilled({ value: unexpectedObject })).toThrowError(expectedError);
        });

        it('should throw error if object passed has NO approvalRequestCreatedDate field.', () => {
            // GIVEN
            const inValidObject = JSON.stringify([demoData[4]]);
            const expectedError = new Error('Value passed for validation is not a valid Approval Request object.');

            // THEN
            expect(() => validators.approvalsFulfilled({ value: inValidObject })).toThrowError(expectedError);
        });

        it('should provide validation error if any Rejected Approval Requests are present',  () => {

            // GIVEN
            const expectedResponse = 'The required approvals to progress the case have not been received.';
            const valuesAsJSON = JSON.stringify(demoData.slice(1, 3));

            // THEN
            expect(validators.approvalsFulfilled({ value: valuesAsJSON })).toEqual(expectedResponse);
        });

        it('should provide validation error if any Approval Requests are outstanding',  () => {

            // GIVEN
            const expectedResponse = 'The required approvals to progress the case have not been received.';
            const valuesAsJSON = JSON.stringify([demoData[2], demoData[3]]);

            // THEN
            expect(validators.approvalsFulfilled({ value: valuesAsJSON })).toEqual(expectedResponse);
        });

        it('should provide validation error if no requests exist',  () => {

            // GIVEN
            const expectedResponse = 'The required approvals to progress the case have not been received.';
            const valuesAsJSON = JSON.stringify([]);

            // THEN
            expect(validators.approvalsFulfilled({ value: valuesAsJSON })).toEqual(expectedResponse);
        });

        it('should provide validation error if only cancelled requests exist',  () => {

            // GIVEN
            const expectedResponse = 'The required approvals to progress the case have not been received.';
            const valuesAsJSON = JSON.stringify([demoData[0], demoData[0]]);

            // THEN
            expect(validators.approvalsFulfilled({ value: valuesAsJSON })).toEqual(expectedResponse);
        });

        it('should return "null" when at least 1 "Complete - approved" and others are "Cancelled".', () => {

            // GIVEN
            const expectedMessage = null;
            const testValue = JSON.stringify(demoData.slice(0,2));

            // WHEN-THEN
            expect(validators.approvalsFulfilled({
                value: testValue
            })).toEqual(expectedMessage);
        });

        it('should return default message if value has approvalRequestResponseStatus as cancelled', () => {

            // GIVEN
            const defaultMessage = 'The required approvals to progress the case have not been received.';
            const testValue = JSON.stringify([demoData[0]]);

            // WHEN-THEN
            expect(validators.approvalsFulfilled({
                value: testValue
            })).toEqual(defaultMessage);
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

    describe('Valid within given days validator', () => {
        it('should reject if more than given days after current date', () => {
            let inputDate = new Date();
            inputDate.setDate(inputDate.getDate() + 20);
            expect(validators.isValidWithinGivenDays({ label: 'label', value: inputDate, message: null, props: { days: '10' } })).toEqual('label must be within the next 10 days.');
        });
        it('should accept if any time less than given days after current date', () => {
            expect(validators.isValidWithinGivenDays({ label: 'label', value: new Date(), message: 'message', props: { days: '30' } })).toEqual(null);
        });
    });

    describe('Valid within past given days validator', () => {
        it('should reject if more than given days before current date', () => {
            const inputDate = new Date();
            inputDate.setDate(inputDate.getDate() - 20);
            expect(validators.isValidWithinPastGivenDays({ label: 'label', value: inputDate, message: null, props: { days: '10' } })).toEqual('label must be within the last 10 days.');
        });
        it('should accept if any time less than given days before current date', () => {
            expect(validators.isValidWithinPastGivenDays({ label: 'label', value: new Date(), message: 'message', props: { days: '30' } })).toEqual(null);
        });
    });

});

describe('Validation middleware', () => {
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
    });

    it('should throw error on no schema', () => {
        const data = {
            'test-pass': 'TEST',
            'test-fail': null
        };

        expect(() => {
            validateForm(undefined, data);
        }).toThrowError(FormSubmissionError);
    });

    it('should validate fields', () => {
        const schema = {
            fields: [
                { validation: ['required'], props: { name: 'test-pass', label: 'Test Pass' } },
                { validation: ['required'], props: { name: 'test-fail', label: 'Test Fail' } }
            ]
        };
        const data = {
            'test-pass': 'TEST',
            'test-fail': null
        };

        expect(() => {
            validateForm(schema, data);
        }).toThrowError(ValidationError);
    });

    it('should validate fields within expandable checkbox', () => {
        const schema = {
            fields: [
                {
                    component: 'expandable-checkbox', validation: [], props: {
                        name: 'checkbox', label: '', items: [
                            { validation: ['required'], props: { name: 'test-pass', label: 'Test Pass' } },
                            { validation: ['required'], props: { name: 'test-fail', label: 'Test Fail' } }]
                    }
                }
            ]
        };
        const data = {
            'checkbox': null,
            'test-pass': 'TEST',
            'test-fail': null
        };

        expect(() => {
            validateForm(schema, data);
        }).toThrowError(ValidationError);
    });

    it('should skip when no validation rules passed', () => {
        const schema = {
            fields: [
                { props: { name: 'test-pass', label: 'Test Pass' } }
            ]
        };
        const data = {
            'test-pass': 'TEST',
        };

        expect(() => {
            validateForm(schema, data);
        }).not.toThrow();
    });

    it('should create an error when validator does not exist', () => {
        const schema = {
            fields: [
                { validation: ['UNSUPPORTED_VALIDATOR'], props: { name: 'test-field', label: 'Test Field' } }
            ]
        };
        const data = {
            'test-field': 'TEST',
        };

        expect(() => {
            validateForm(schema, data);
        }).toThrow('Validator UNSUPPORTED_VALIDATOR does not exist');
    });

    it('should validate if radio button has conditionalContent', () => {
        const schema = {
            title: 'Some title',
            defaultActionLabel: 'Continue',
            fields: [
                {
                    validation: ['required'],
                    component: 'radio',
                    props: {
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
        };
        const visibleFields = [
            {
                validation: ['required'],
                component: 'radio',
                props: {
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
            }
        ];
        const data = {
            TestRadioField: 'TestRadioFieldValue',
            RefType: '',
            Priority: '',
            ChannelIn: '',
            TestRadioFieldValueText: ''
        };

        expect(() => {
            validateForm(schema, visibleFields, data);
        }).toThrow('Form validation failed');
    });

    it('should validate radio button first if radio button has conditionalContent', () => {
        const schema =  {
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
        };
        const data = {
            TestEmptyRadioField: '',
            RefType: '',
            Priority: '',
            ChannelIn: '',
            TestEmptyRadioFieldValueText: ''
        };

        expect(() => {
            validateForm(schema, data);
        }).toThrow('Form validation failed');
    });

    it('should validate form', () => {
        const schema = {
            fields: [
                { props: { name: 'fieldOne', label: 'Field One' } },
            ],
            validation: [{
                options: ['fieldOne'],
                validator: 'oneOf'
            }]
        };
        const data = {
            'fieldOne': 'Yes',
        };

        expect(() => {
            validateForm(schema, data);
        }).not.toThrowError();
    });

});
