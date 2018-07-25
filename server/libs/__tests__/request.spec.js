const request = require('../request');

describe('request', () => {
    it('should export an Workflow Service client', () => {
        expect(request.workflowServiceClient).toBeDefined;
        expect(typeof request.workflowServiceClient).toBe('function');
    });
});