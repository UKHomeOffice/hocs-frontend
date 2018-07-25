const aws = require('../aws');

describe('AWS', () => {
    it('should export an S3 client', () => {
        expect(aws.s3).toBeDefined;
        expect(typeof aws.s3).toBe('object');
    });
});