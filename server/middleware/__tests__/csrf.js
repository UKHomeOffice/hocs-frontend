const { csrfMiddleware } = require('../csrf.js');

describe('CSRF middleware', () => {
    let req = {};
    let res = {};
    const getHeader = jest.fn();
    const setHeader = jest.fn();
    const next = jest.fn();
    beforeEach(() => {
        req = {
            cookies: {},
            headers: []
        };
        res = {
            getHeader,
            setHeader
        };
        next.mockReset();
        setHeader.mockReset();
    });

    it('should add the csrfToken method', async () => {
        await csrfMiddleware(req, res, next);
        expect(req.csrfToken()).toBeDefined();
    });

    it('should add the csrf cookie', async () => {
        await csrfMiddleware(req, res, next);
        expect(res.setHeader).toBeCalledWith('set-cookie', expect.any(Array));
    });

    it('should call the next handler', async () => {
        await csrfMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
