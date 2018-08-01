import { errorMiddleware, errorAjaxResponseMiddleware } from '../request';

describe('Error middleware', () => {

    let req = {};
    let res = {};
    let err = {
        message: 'ERROR_MESSAGE',
        stack: 'ERROR_STACK'
    };
    const send = jest.fn();
    const next = jest.fn();

    beforeEach(() => {
        send.mockReset();
        next.mockReset();
        req = {};
        res = {};
    });

    it('should ', () => {
        errorMiddleware(err, req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.error).toBeDefined();
        expect(res.error.errorCode).toEqual(500);
        expect(res.error.error).toEqual(err.message);
        expect(res.error.stack).toEqual(err.stack);
    });

});

describe('Error AJAX response middleware', () => {

    let req = {};
    let res = {};
    const send = jest.fn();
    const next = jest.fn();
    const status = jest.fn(() => ({
        send
    }));

    beforeEach(() => {
        send.mockReset();
        next.mockReset();
        req = {
            form: { errors: {} }
        };
        res = {
            status
        };
    });

    it('should call the next middleware when client has Javascript disabled', () => {
        res.noScript = true;
        errorAjaxResponseMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(send).not.toHaveBeenCalled();
    });

    it('should return form validation errors', () => {
        errorAjaxResponseMiddleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        expect(send.mock.calls[0][0].errors).toBeDefined();
        expect(typeof send.mock.calls[0][0].errors).toEqual('object');
    });

    it('should return an ErrorModel instance if set on the response object', () => {
        res.error = {
            errorCode: 418
        };
        errorAjaxResponseMiddleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(418);
        expect(send).toHaveBeenCalled();
        expect(send.mock.calls[0][0].errorCode).toEqual(418);
    });

});