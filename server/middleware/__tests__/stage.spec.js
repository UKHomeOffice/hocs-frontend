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
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        res = {
            status, redirect
        };
        next.mockReset();
        send.mockReset();
        redirect.mockReset();
    });

    it('should send a 200/OK response and a callback URL', async () => {
        const actionService = require('../../services/action.js');
        actionService.performAction.mockImplementation(() => {
            return { callbackUrl: '/' };
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(redirect).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith('/');
    });

    it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
        const actionService = require('../../services/action.js');
        const mockError = new Error('TEST_ERROR');
        actionService.performAction.mockImplementation(() => {
            return Promise.reject(mockError);
        });
        const { stageResponseMiddleware } = require('../stage.js');
        await stageResponseMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);
    });

});