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
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[0], 'TestField', 'TestValue')).toBe(false);
        });
        it('returns false if the data does not contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[1], 'TestField', 'TestValue')).toBe(false);
        });
        it('returns false if the data array does not contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[2], 'TestField', 'Test3')).toBe(false);
        });
        it('returns true if the data array does contain the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[2], 'TestField', 'Test1')).toBe(true);
        });
        it('returns false if the data value does not match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3], 'TestField', 'Test2')).toBe(false);
        });
        it('returns false if the data value does not match exactly the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3], 'TestField', 'Test2111')).toBe(false);
        });
        it('returns true if the data value does match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[3], 'TestField', 'Test1')).toBe(true);
        });
        it('returns false if the data comma-separated value does not match exactly the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[4], 'TestField', 'Test')).toBe(false);
        });
        it('returns true if the data comma-separated value does match the requested value', () => {
            expect(showConditionFunctions.hasCommaSeparatedValue(mockData[4], 'TestField', 'Test1')).toBe(true);
        });
    });
});
