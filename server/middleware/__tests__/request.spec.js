import { axiosErrorMiddleware, errorMiddleware, apiErrorMiddleware } from '../request';
import { GenericError } from '../../models/error';


describe('Axios error middleware', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    beforeEach(() => {
        next.mockReset();
    });

    it('should pass through response data if present', () => {
        const err = {
            isAxiosError: true,
            response: {
                data: 'TEST',
                status: 400
            }
        };

        axiosErrorMiddleware(err, req, res, next);

        expect(next).toHaveBeenCalledWith(new GenericError('TEST', 400));
    });

    it('should pass through request if response is not present', () => {
        const err = {
            isAxiosError: true,
            request: { },
            config: {
                url: 'http://TESTURL/'
            },
            code: 'ECONNABORTED'
        };

        axiosErrorMiddleware(err, req, res, next);

        expect(next).toHaveBeenCalledWith(new GenericError(`Failed to request following endpoint ${err.config.url} for reason ${err.code}`, 500));
    });

    it('should fallback to GenericError if response or request is not present', () => {
        const err = {
            isAxiosError: true,
            config: {
                url: 'http://TESTURL/'
            },
            code: 'ECONNABORTED'
        };

        axiosErrorMiddleware(err, req, res, next);

        expect(next).toHaveBeenCalledWith(new GenericError(`Axios failed to process the request for reason ${err.code}`, 500));
    });

    it('should bypass and pass error to next middleware', () => {
        const err = {
            message: 'MOCK_ERROR',
            status: 418,
            title: 'MOCK_TITLE',
            stack: 'MOCK_STACK'
        };

        axiosErrorMiddleware(err, req, res, next);

        expect(next).toHaveBeenCalledWith(err);
    });
});

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
