const { resolveDeadlineDisplay, resolveDeadlineDisplayWithDateFormatting } = require('../deadlineDisplayHelpers');


describe('deadlineDisplayHelpers.js', () => {

    describe('resolveDeadlineDisplay', () => {

        it('should return \'Suspended\'', () => {
            const deadline = '9999-12-31';
            const isSuspended = 'true';

            const output = resolveDeadlineDisplay(deadline, isSuspended);

            expect(output).toBe('Suspended');
        });

        it('should return \'N/A\'', () => {
            const deadline = '9999-12-31';
            const isSuspended = false;

            const output = resolveDeadlineDisplay(deadline, isSuspended);

            expect(output).toBe('N/A');
        });

        it('should return date in format yyyy-MM-dd', () => {
            const deadline = '2022-04-20';
            const isSuspended = false;

            const output = resolveDeadlineDisplay(deadline, isSuspended);

            expect(output).toBe(deadline);
        });
    });


    describe('resolveDeadlineDisplayWithDateFormatting', () => {

        it('should return \'Suspended\'', () => {
            const deadline = '9999-12-31';
            const isSuspended = 'true';

            const output = resolveDeadlineDisplayWithDateFormatting(deadline, isSuspended);

            expect(output).toBe('Suspended');
        });

        it('should return \'N/A\'', () => {
            const deadline = '9999-12-31';
            const isSuspended = false;

            const output = resolveDeadlineDisplayWithDateFormatting(deadline, isSuspended);

            expect(output).toBe('N/A');
        });

        it('should return date in format dd/MM/yyyy', () => {
            const deadline = '2022-04-20';
            const isSuspended = false;

            const output = resolveDeadlineDisplayWithDateFormatting(deadline, isSuspended);

            expect(output).toBe('20/04/2022');
        });
    });
});