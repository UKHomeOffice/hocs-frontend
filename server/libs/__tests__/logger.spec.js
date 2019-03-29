const logger = require('../logger');

describe('logger', () => {
    it('should export logger middleware', () => {
        expect(logger).toBeDefined;
        expect(typeof logger).toBe('function');
    });
});