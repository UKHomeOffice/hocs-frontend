const { getObjectNameValue } = require('../objectHelpers');

describe('Object helper', () => {

    describe('getObjectNameValue', () => {
        it('should return values for object with single value', () => {
            const object = { 'Foo': 1 };
            const [name, value] = getObjectNameValue(object);

            expect(name).toEqual('Foo');
            expect(value).toEqual(1);
        });

        it('should return first valid values for object with multiple values', () => {
            const object = { 'Foo': 1, 'Bar': 2 };
            const [name, value] = getObjectNameValue(object);

            expect(name).toEqual('Foo');
            expect(value).toEqual(1);
        });

        it('should return empty array for param that is not an object', () => {
            const [name, value] = getObjectNameValue([]);

            expect(name).toEqual('');
            expect(value).toEqual('');
        });

        it('should return empty array for param that is undefined', () => {
            const [name, value] = getObjectNameValue(undefined);

            expect(name).toEqual('');
            expect(value).toEqual('');
        });

        it('should return empty array for param that is empty object', () => {
            const [name, value] = getObjectNameValue({});

            expect(name).toEqual('');
            expect(value).toEqual('');
        });

    });

});
