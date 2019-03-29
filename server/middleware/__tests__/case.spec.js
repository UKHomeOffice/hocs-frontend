const {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware
} = require('../case.js');

jest.mock('../../services/action.js', () => ({
    performAction: jest.fn()
}));

jest.mock('../../clients', () => ({
    caseworkService: {
        get: jest.fn()
    }
}));

const { caseworkService } = require('../../clients');

describe('Case middleware', () => {

    describe('Case response middleware', () => {

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

        it('should send a 200/OK response and a callback URL', async () => {
            const actionService = require('../../services/action.js');
            actionService.performAction.mockImplementation(() => {
                return Promise.resolve({ callbackUrl: '/' });
            });

            await caseResponseMiddleware(req, res, next);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const actionService = require('../../services/action.js');
            const mockError = new Error('TEST_ERROR');
            actionService.performAction.mockImplementation(() => {
                return Promise.reject(mockError);
            });
            await caseResponseMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('Case API response middleware', () => {

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
            await caseApiResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const actionService = require('../../services/action.js');
            const mockError = new Error('TEST_ERROR');
            actionService.performAction.mockImplementation(() => {
                return Promise.reject(mockError);
            });
            await caseApiResponseMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('Case summary response middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();

        beforeEach(() => {
            req = {
                params: {
                    caseId: 'CASE_ID'
                },
                user: {
                    id: 'test',
                    roles: [],
                    groups: []
                },
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'CASE_SUMMARY') {
                            return Promise.resolve('MOCK_SUMMARY');
                        }
                        return Promise.reject();
                    })
                }
            };

            res = {
                status: null,
                locals: {}
            };
            next.mockReset();
        });

        it('should add summary to res.locals if returned from call to API', async () => {
            await caseSummaryMiddleware(req, res, next);
            expect(res.locals.summary).toBeDefined();
            expect(res.locals.summary).toEqual('MOCK_SUMMARY');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if call to API fails', async () => {
            const mockError = new Error('Something went wrong');
            req.listService.fetch.mockImplementation(() => Promise.reject(mockError));
            await caseSummaryMiddleware(req, res, next);
            expect(res.locals.summary).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('Case summary API response middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();
        const json = jest.fn();

        beforeEach(() => {
            res = {
                status: null,
                locals: { summary: 'MOCK_SUMMARY' }
            };
            next.mockReset();
            json.mockReset();
            res.status = jest.fn(() => ({ json }));
        });

        it('should add summary to res.locals if returned from call to API', async () => {
            caseworkService.get.mockImplementation(() => Promise.resolve({ data: 'MOCK_SUMMARY' }));
            await caseSummaryApiResponseMiddleware(req, res, next);
            expect(res.locals.summary).toBeDefined();
            expect(res.locals.summary).toEqual('MOCK_SUMMARY');
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith('MOCK_SUMMARY');
        });
    });

});