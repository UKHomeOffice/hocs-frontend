import { fileMiddleware } from '../file';

describe('File Middleware', () => {
    it('should export an instance of Multer', () => {
        expect(fileMiddleware).toBeDefined;
        expect(fileMiddleware.constructor.name).toEqual('Multer');
    });

    it('should have the Multer instance configured for S3 storage', () => {
        expect(fileMiddleware).toBeDefined;
        expect(fileMiddleware.storage.constructor.name).toEqual('S3Storage');
    });
});