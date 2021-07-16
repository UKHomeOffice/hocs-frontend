const doubleEncodeSlashes = require('../encodingHelpers');

describe('Encoding helper', () => {
    describe('doubleEncodeSlashes', () => {
        it('should replace all single encoded slashes with double encoded slashes', () => {
            const singleEncoded = '01%2F1000002%2Faaa';
            const doubleEncoded = doubleEncodeSlashes(singleEncoded);

            expect(doubleEncoded).toBeDefined;
            expect(doubleEncoded).toEqual('01%252F1000002%252Faaa');
        });
    });
});
