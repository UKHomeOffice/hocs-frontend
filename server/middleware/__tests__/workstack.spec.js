const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware
} = require('../workstack');

jest.mock('../../services/list', () => ({
    getList: jest.fn()
}));

let req = {};
let res = {};
const next = jest.fn();
const listService = require('../../services/list');

describe('Workstack middleware', () => {

    describe('User workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {};
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_WORKSTACK'));
            await userWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await userWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Team workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {};
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_WORKSTACK'));
            await teamWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await teamWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Workflow workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {};
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_WORKSTACK'));
            await workflowWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await workflowWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Stage workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {};
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_WORKSTACK'));
            await stageWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await stageWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Workstack API response.middleware', () => {

        beforeEach(() => {
            req = {};
            res = {
                locals: { workstack: 'MOCK_WORKSTACK' },
                json: jest.fn()
            };
        });

        it('should send the workstack data from res.locals', () => {
            workstackApiResponseMiddleware(req, res);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith('MOCK_WORKSTACK');
        });
    });
});