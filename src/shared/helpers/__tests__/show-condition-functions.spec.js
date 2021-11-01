import showConditionFunctions from '../show-condition-functions';

describe('ShowConditionFunctions', () => {
    describe('hasCommaSeparatedValue', () => {
        const mockData = [
            {},
            {
                TestField: ''
            },
            {
                TestField: ['Test1', 'Test2']
            },
            {
                TestField: 'Test1'
            },
            {
                TestField: 'Test1,Test2'
            }
        ];

        it('returns false if the data does not exist', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[0],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'TestValue' } ])).toBe(false);
        });
        it('returns false if the data does not contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[1],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'TestValue' } ])).toBe(false);
        });
        it('returns false if the data array does not contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[2],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test3' } ])).toBe(false);
        });
        it('returns true if the data array does contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[2],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test1' } ])).toBe(true);
        });
        it('returns false if the data value does not match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test2' } ])).toBe(false);
        });
        it('returns false if the data value does not match exactly the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test2111' } ])).toBe(false);
        });
        it('returns true if the data value does match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test1' } ])).toBe(true);
        });
        it('returns false if the data comma-separated value does not match exactly the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[4],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test' } ])).toBe(false);
        });
        it('returns true if the data comma-separated value does match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[4],
                [ { conditionPropertyName: 'TestField', conditionPropertyValue: 'Test1' } ])).toBe(true);
        });
    });
});
