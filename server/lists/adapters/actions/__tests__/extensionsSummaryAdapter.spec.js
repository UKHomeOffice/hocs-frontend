const extAdapter = require('../extensionsSummaryAdapter');

describe('extensionsSummaryAdapter,js', () => {

    it('should always return null', () => {

        const extensions = {};

        const result = extAdapter(extensions);
        expect(result).toBeNull();
    });
});