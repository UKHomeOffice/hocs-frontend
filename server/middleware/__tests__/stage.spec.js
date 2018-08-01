jest.mock('../../services/action.js', () => {
    return {
        performAction: jest.fn()
    };
});

describe('Stage middleware', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const send = jest.fn();
    const status = jest.fn(() => ({
        send
    }));
    const redirect = jest.fn();

    beforeEach(() => {
        req = {
            form: { errors: {} },
            params: {
                caseId: 'CASE_ID',
                stageId: 'STAGE_ID'
            }
        };
        res = {
            status, redirect
        };
        next.mockReset();
        send.mockReset();
        redirect.mockReset();
    });

    it('should send a 200/OK response and a callback URL when noScript is false', async () => {
        const actionService = require('../../services/action.js');
        actionService.performAction.mockImplementation(() => {
            return { callbackUrl: '/' };
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(send).toHaveBeenCalled();
        expect(send.mock.calls[0][0].redirect).toBeDefined();
        expect(send.mock.calls[0][0].redirect).toEqual('/');
        expect(status).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(redirect).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to the callback URL when noScript is true', async () => {
        res = {
            status, redirect, noScript: true
        };
        const actionService = require('../../services/action.js');
        actionService.performAction.mockImplementation(() => {
            return { callbackUrl: '/' };
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(redirect).toHaveBeenCalled();
        expect(redirect.mock.calls[0][0]).toBeDefined();
        expect(redirect.mock.calls[0][0]).toEqual('/');
        expect(send).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
        const actionService = require('../../services/action.js');
        actionService.performAction.mockImplementation(() => {
            return { error: { message: 'TEST_ERROR' } };
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(send).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
        expect(res.error).toBeDefined();
    });

    it('should call the next middleware if form validation errors are on the request object', async () => {
        req.form.errors = ['1', '2', '3'];
        const actionService = require('../../services/action.js');
        actionService.performAction.mockImplementation(() => {
            return {};
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(send).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
        expect(res.error).not.toBeDefined();
    });

});