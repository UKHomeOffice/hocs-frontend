const { setCacheControl } = require('../cacheControl.js');

describe('Cache control middleware', () => {
    let req = {};
    let res = {};
    const setHeader = jest.fn();
    const next = jest.fn();
    beforeEach(() => {
        res = {
            setHeader
        };
        next.mockReset();
        setHeader.mockReset();
    });

    it('should call the setHeader method on the response', async () => {
        await setCacheControl(req, res, next);
        expect(setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store, must-revalidate, pre-check=0, post-check=0, max-age=0, s-maxage=0');
    });

    it('should call the next handler', async () => {
        await setCacheControl(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
