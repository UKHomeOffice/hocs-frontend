const {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware,
    caseCorrespondentsApiResponseMiddleware,
    caseCorrespondentsMiddleware
} = require('../case.js');

jest.mock('../../services/action.js', () => ({
    performAction: jest.fn()
}));

jest.mock('../../clients', () => ({
    caseworkService: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn()
    }
}));

const { caseworkService } = require('../../clients');
const { caseDataMiddleware, createCaseNote, updateCaseNote, caseConfigMiddleware } = require('../case');

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

    describe('Case config response middleware', () => {

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
                        if (list === 'CASE_CONFIG') {
                            return Promise.resolve('MOCK_CONFIG');
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

        it('should add case config to res.locals if returned from call to API', async () => {
            await caseConfigMiddleware(req, res, next);
            expect(res.locals.caseConfig).toBeDefined();
            expect(res.locals.caseConfig).toEqual('MOCK_CONFIG');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if call to API fails', async () => {
            const mockError = new Error('Something went wrong');
            req.listService.fetch.mockImplementation(() => Promise.reject(mockError));
            await caseConfigMiddleware(req, res, next);
            expect(res.locals.caseConfig).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('Case data middleware', () => {

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
                        if (list === 'CASE_DATA') {
                            return Promise.resolve('MOCK_DATA');
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

        it('should add data to res.locals if returned from call to API', async () => {
            await caseDataMiddleware(req, res, next);
            expect(res.locals.caseData).toBeDefined();
            expect(res.locals.caseData).toEqual('MOCK_DATA');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if call to API fails', async () => {
            const mockError = new Error('Something went wrong');
            req.listService.fetch.mockImplementation(() => Promise.reject(mockError));
            await caseDataMiddleware(req, res, next);
            expect(res.locals.caseData).not.toBeDefined();
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

    describe('Case correspondents API response middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();
        const json = jest.fn();

        beforeEach(() => {
            res = {
                status: null,
                locals: { correspondents: 'MOCK_CORRESPONDENTS' }
            };
            next.mockReset();
            json.mockReset();
            res.status = jest.fn(() => ({ json }));
        });

        it('should add correspondents to res.locals if returned from call to API', async () => {
            caseworkService.get.mockImplementation(() => Promise.resolve({ data: 'MOCK_CORRESPONDENTS' }));
            await caseCorrespondentsApiResponseMiddleware(req, res, next);
            expect(res.locals.correspondents).toBeDefined();
            expect(res.locals.correspondents).toEqual('MOCK_CORRESPONDENTS');
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith('MOCK_CORRESPONDENTS');
        });
    });

    describe('Case correspondents middleware', () => {

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
                        if (list === 'CASE_CORRESPONDENTS_ALL') {
                            return Promise.resolve('MOCK_CORRESPONDENTS');
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

        it('should add correspondents to res.locals if returned from call to API', async () => {
            await caseCorrespondentsMiddleware(req, res, next);
            expect(res.locals.correspondents).toBeDefined();
            expect(res.locals.correspondents).toEqual('MOCK_CORRESPONDENTS');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if call to API fails', async () => {
            const mockError = new Error('Something went wrong');
            req.listService.fetch.mockImplementation(() => Promise.reject(mockError));
            await caseSummaryMiddleware(req, res, next);
            expect(res.locals.correspondents).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('createCaseNote', () => {
        let req = {};
        let res = {};
        const next = jest.fn();

        const generateWhitespace = (number) => ''.padEnd(number, ' ');

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
                body: {}
            };

            res = {
                status: null,
                locals: {}
            };

            next.mockReset();
            caseworkService.post.mockReset();
        });

        it('should call next with error if caseNote is undefined', async () => {
            await createCaseNote(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.locals.error).toEqual('Case note must not be blank');
            expect(caseworkService.post.mock.calls.length).toEqual(0);
        });


        it('should call next with error if caseNote is all whitespace', async () => {
            req.body = { caseNote: generateWhitespace(100000) };

            await createCaseNote(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.locals.error).toEqual('Case note must not be blank');
            expect(caseworkService.post.mock.calls.length).toEqual(0);
        });

        it('should call next after successful post', async () => {
            req.body = { caseNote: 'Test' + generateWhitespace(10) };

            caseworkService.post.mockImplementation(() => Promise.resolve({ data: 'MOCK_SUMMARY' }));
            await createCaseNote(req, res, next);

            expect(caseworkService.post.mock.calls.length).toEqual(1);
            // The request param of the first call
            expect(caseworkService.post.mock.calls[0][1]).toEqual({ 'text': 'Test', 'type': 'MANUAL' });
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if failed to add note', async () => {
            req.body = { caseNote: 'Test' };

            caseworkService.post.mockImplementation(() => Promise.reject({ data: 'MOCK_SUMMARY' }));
            await createCaseNote(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Failed to attach case note to case CASE_ID'));
        });
    });

    describe('updateCaseNote', () => {
        let req = {};
        let res = {};
        const next = jest.fn();

        const generateWhitespace = (number) => ''.padEnd(number, ' ');

        beforeEach(() => {
            req = {
                params: {
                    caseId: 'CASE_ID',
                    noteId: 'NOTE_ID'
                },
                user: {
                    id: 'test',
                    roles: [],
                    groups: []
                },
                body: {}
            };

            res = {
                status: null,
                locals: {}
            };

            next.mockReset();
            caseworkService.put.mockReset();
        });

        it('should call next with error if caseNote is undefined', async () => {
            await updateCaseNote(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.locals.error).toEqual('Case note must not be blank');
            expect(caseworkService.put.mock.calls.length).toEqual(0);
        });


        it('should call next with error if caseNote is all whitespace', async () => {
            req.body = { caseNote: generateWhitespace(100000) };

            await updateCaseNote(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.locals.error).toEqual('Case note must not be blank');
            expect(caseworkService.put.mock.calls.length).toEqual(0);
        });

        it('should call next after successful post', async () => {
            req.body = { caseNote: 'Test' + generateWhitespace(10) };

            caseworkService.put.mockImplementation(() => Promise.resolve({ data: 'MOCK_SUMMARY' }));
            await updateCaseNote(req, res, next);

            expect(caseworkService.put.mock.calls.length).toEqual(1);
            // The request param of the first call
            expect(caseworkService.put.mock.calls[0][1]).toEqual({ 'text': 'Test', 'type': 'MANUAL' });
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if failed to add note', async () => {
            req.body = { caseNote: 'Test' };

            caseworkService.put.mockImplementation(() => Promise.reject({ data: 'MOCK_SUMMARY' }));
            await updateCaseNote(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Failed to update case note NOTE_ID on case CASE_ID'));
        });
    });

});
