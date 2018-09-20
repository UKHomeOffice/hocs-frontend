import { errorMiddleware, apiErrorMiddleware } from '../request';

describe('Error middleware', () => {

    let req = {};
    let res = {};
    const send = jest.fn();
    const next = jest.fn();

    beforeEach(() => {
        send.mockReset();
        next.mockReset();
        req = {};
        res = { locals: {} };
    });

    it('should put the error object in response locals', () => {
        const err = {
            message: 'MOCK_ERROR',
            status: 418,
            title: 'MOCK_TITLE',
            stack: 'MOCK_STACK'
        };
        errorMiddleware(err, req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.locals.error).toBeDefined();
        expect(res.locals.error.message).toEqual(err.message);
        expect(res.locals.error.status).toEqual(err.status);
        expect(res.locals.error.title).toEqual(err.title);
        expect(res.locals.error.stack).toEqual(err.stack);
    });

});

describe('Error AJAX response middleware', () => {

    let req = {};
    let res = {};
    const json = jest.fn();
    const next = jest.fn();
    const status = jest.fn(() => ({
        json
    }));

    beforeEach(() => {
        json.mockReset();
        next.mockReset();
        req = {
            form: { errors: {} }
        };
        res = {
            status
        };
    });

    it('should return errors', () => {
        const err = {
            message: 'MOCK_ERROR',
            status: 418,
            title: 'MOCK_TITLE',
            stack: 'MOCK_STACK'
        };
        apiErrorMiddleware(err, req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(err.status);
        expect(json).toHaveBeenCalled();
        expect(json.mock.calls[0][0]).toBeDefined();
        expect(json.mock.calls[0][0].message).toEqual(err.message);
        expect(json.mock.calls[0][0].status).toEqual(err.status);
        expect(json.mock.calls[0][0].title).toEqual(err.title);
        expect(json.mock.calls[0][0].stack).toEqual(err.stack);
    });

    it('should default the status code to 500 if not set', () => {
        const err = {};
        apiErrorMiddleware(err, req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalled();
        expect(json.mock.calls[0][0].status).toEqual(500);
    });

});