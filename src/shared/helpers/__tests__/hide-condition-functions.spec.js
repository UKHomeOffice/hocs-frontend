import HideConditionFunctions from './../hide-condition-functions';

describe('HideConditionFunctions', () => {
    describe('hasNoContributionsOrFulfilled', () => {
        const mockData = [
            {},
            {
                CaseContributions: '{}'
            },
            {
                CaseContributions: 'INVALID_JSON'
            },
            {
                CaseContributions: '[{"data": { "contributionStatus": "test"}}]'
            },
            {
                CaseContributions: '[{"data": { "test": "test"}}]'
            },
            {
                CaseContributions: '[{"data": { "contributionStatus": "test"}}, {"data": { "test": "test"}}]'
            }
        ];

        it('returns true if CaseContributions does not exist', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[0])).toBe(true);
        });
        it('returns true if CaseContributions is not an array', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[1])).toBe(true);
        });
        it('returns true if CaseContributions is not valid JSON', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[2])).toBe(true);
        });
        it('returns true if all contribitions have status', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[3])).toBe(true);
        });
        it('returns false if contribution does not have status', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[4])).toBe(false);
        });
        it('returns false if one of multiple contributions does not have status', () => {
            expect(HideConditionFunctions.hasNoContributionsOrFulfilled(mockData[5])).toBe(false);
        });
    });
});
