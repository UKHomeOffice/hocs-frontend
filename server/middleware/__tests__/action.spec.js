const { actionResponseMiddleware, apiActionResponseMiddleware } = require('../action.js');

jest.mock('../../services/action.js', () => {
    return {
        performAction: jest.fn()
    };
});

describe('Action middleware', () => {

    describe('Action response middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();

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
                redirect: jest.fn(),
                locals: {}
            };
            next.mockReset();
        });

        it('should redirect if callbackUrl returned from performAction', async () => {
            const actionService = require('../../services/action.js');
            actionService.performAction.mockImplementation(() => {
                return Promise.resolve({ callbackUrl: '/' });
            });
            await actionResponseMiddleware(req, res, next);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should add confirmation to res.locals if returned from performAction', async () => {
            const actionService = require('../../services/action.js');
            actionService.performAction.mockImplementation(() => {
                return Promise.resolve({ confirmation: 'Success!' });
            });
            await actionResponseMiddleware(req, res, next);
            expect(res.locals.confirmation).toBeDefined();
            expect(res.locals.confirmation).toEqual('Success!');
            expect(next).toHaveBeenCalled();
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const actionService = require('../../services/action.js');
            const mockError = new Error('TEST_ERROR');
            actionService.performAction.mockImplementation(() => {
                return Promise.reject(mockError);
            });
            await actionResponseMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('Action API response middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();
        const json = jest.fn();

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
                status: null,
                locals: {}
            };
            next.mockReset();
            json.mockReset();
            res.status = jest.fn(() => ({ json }));
        });

        it('should redirect if callbackUrl returned from performAction', async () => {
            const actionService = require('../../services/action.js');
            actionService.performAction.mockImplementation(() => {
                return Promise.resolve({ callbackUrl: '/' });
            });
            await apiActionResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should add confirmation to res.locals if returned from performAction', async () => {
            const actionService = require('../../services/action.js');
            actionService.performAction.mockImplementation(() => {
                return Promise.resolve({ confirmation: 'Success!' });
            });
            await apiActionResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ confirmation: 'Success!' });
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const actionService = require('../../services/action.js');
            const mockError = new Error('TEST_ERROR');
            actionService.performAction.mockImplementation(() => {
                return Promise.reject(mockError);
            });
            await apiActionResponseMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

});