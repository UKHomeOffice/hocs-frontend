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

    describe('hasAnyValue', () => {

        it('should return true when conditionPropertyName is absent in data',  () => {

            const data =  {};
            const conditionArgs = {
                'conditionPropertyName': 'var1'
            };

            const result = HideConditionFunctions.hasAnyValue(data, conditionArgs);

            expect(result).toBeTruthy();
        });

        it('should return true when conditionPropertyName has empty string val in data',  () => {

            const data =  {
                'var1': ''
            };
            const conditionArgs = {
                'conditionPropertyName': 'var1'
            };

            const result = HideConditionFunctions.hasAnyValue(data, conditionArgs);

            expect(result).toBeTruthy();
        });

        it('should return true when conditionPropertyName has "null" value in data',  () => {

            const data =  {
                'var1': null
            };

            const conditionArgs = {
                'conditionPropertyName': 'var1'
            };

            const result = HideConditionFunctions.hasAnyValue(data, conditionArgs);

            expect(result).toBeTruthy();
        });

        it('should return false when conditionPropertyName has string val in data',  () => {

            const data =  {
                'var1': 'val1'
            };

            const conditionArgs = {
                'conditionPropertyName': 'var1'
            };

            const result = HideConditionFunctions.hasAnyValue(data, conditionArgs);

            expect(result).toBeFalsy();
        });

        it('should return false when conditionPropertyName has number val in data',  () => {

            const data =  {
                'var1': 100
            };

            const conditionArgs = {
                'conditionPropertyName': 'var1'
            };

            const result = HideConditionFunctions.hasAnyValue(data, conditionArgs);

            expect(result).toBeFalsy();
        });
    });
});
