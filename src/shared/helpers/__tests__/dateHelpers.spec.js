import { isDateTodayOrAfter } from '../date-helpers';

describe('Date helper', () => {
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
