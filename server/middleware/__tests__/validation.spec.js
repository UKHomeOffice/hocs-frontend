const { validators, validationMiddleware } = require('../validation.js');

jest.mock('../../config.js', () => {
    return {
        forContext: context => {
            switch (context) {
                case 'server':
                    return {
                        DOCUMENT_WHITELIST: ['validExtension']
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
});