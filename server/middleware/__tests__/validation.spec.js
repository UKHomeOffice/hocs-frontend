const validators = require('../validation.js').validators;

describe('Validation methods', () => {
    describe('Required validator', () => {
        it('should reject an empty field', () => {
            expect(validators.required(null)).not.toEqual(null);
        });
        it('should accept a filled field', () => {
            expect(validators.required('data')).toEqual(null);
        });
    });

    describe('Valid date validator', () => {
        it('should reject not-real dates', () => {
            expect(validators.isValidDate('2011-02-33')).not.toEqual(null);
        });
        it('should reject things that aren\'t numbers', () => {
            expect(validators.isValidDate('belgium')).not.toEqual(null);
        });
        it('should accept a valid date', () => {
            expect(validators.required('2011-02-30')).toEqual(null);
        });
        it('should reject a malformed date', () => {
            expect(validators.isValidDate('2011--01')).not.toEqual(null);
        });
    });
    describe('Before today validator', () => {
        it('should accept a date in the past', () => {
            expect(validators.isBeforeToday('1970-01-01')).toEqual(null);
        });
        it('should reject a date in the future', () => {
            expect(validators.isBeforeToday('3000-01-01')).not.toEqual(null);
        });
    });
    describe('After today validator', () => {
        it('should reject a date in the past', () => {
            expect(validators.isAfterToday('1970-01-01')).not.toEqual(null);
        });
        it('should accept a date in the future', () => {
            expect(validators.isAfterToday('3000-01-01')).toEqual(null);
        });
    });
});