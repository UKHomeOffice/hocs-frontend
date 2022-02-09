const { addDays, getUtcDateString, isDateTodayOrAfter } = require('../dateHelpers');

describe('Date helper', () => {
    describe('addDays', () => {
        it('should add a day and be 29 Feb on leap year', () => {
            const date = addDays('2020-02-28', 1);

            expect(date).toBeDefined;
            expect(date).toEqual(new Date('2020-02-29'));
        });

        it('should add a day normally not on leap year', () => {
            const date = addDays('2021-02-28', 1);

            expect(date).toBeDefined;
            expect(date).toEqual(new Date('2021-03-01'));
        });

        it('should add a day normally', () => {
            const date = addDays('2021-01-01', 1);

            expect(date).toBeDefined;
            expect(date).toEqual(new Date('2021-01-02'));
        });

        it('should roll a year over on adding day', () => {
            const date = addDays('2020-12-31', 1);

            expect(date).toBeDefined;
            expect(date).toEqual(new Date('2021-01-01'));
        });
    });

    describe('getUtcDateString', () => {
        it('should return date for inputted date', () => {
            const returned = getUtcDateString(new Date('2020-12-31 12:30'));

            expect(returned).toBeDefined();
            expect(returned).toEqual('2020-12-31');
        });

        it('should return undefined if input is undefined', () => {
            const returned = getUtcDateString(undefined);

            expect(returned).toBeUndefined();
        });

        it('should return undefined if input is not a date', () => {
            const returned = getUtcDateString('test');

            expect(returned).toBeUndefined();
        });
    });

    describe('isDateTodayOrAfter', () => {
        let originalNowFunc;

        beforeAll(() => {
            originalNowFunc = Date.now;

            Date.now = jest.fn(() =>
                new Date(Date.UTC(2021, 0, 10, 12)).valueOf());
        });

        afterAll(() => {
            Date.now = originalNowFunc;
        });

        it('should return false if the day falls before today', () => {
            const returned = isDateTodayOrAfter('2021-01-9');
            expect(returned).toBeFalsy();
        });

        it('should return true if the day falls today', () => {
            const returned = isDateTodayOrAfter('2021-01-10');
            expect(returned).toBeTruthy();
        });

        it('should return true if the day falls after today', () => {
            const returned = isDateTodayOrAfter('2021-01-11');
            expect(returned).toBeTruthy();
        });
    });
});
