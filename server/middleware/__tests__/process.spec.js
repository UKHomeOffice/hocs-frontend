import processMiddleware from "../process";

describe('Process middleware', () => {
    it('should process form data when passed', () => {
        const req = {
            body: {
                field: 'field value'
            }
        };
        const res = {};

        processMiddleware(req, res, () => {
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
        });
    });
});