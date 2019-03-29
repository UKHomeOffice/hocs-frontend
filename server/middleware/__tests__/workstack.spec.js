const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware
} = require('../workstack');

let req = {};
let res = {};
const next = jest.fn();

describe('Workstack middleware', () => {

    describe('User workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'USER_WORKSTACK') {
                            return Promise.resolve('MOCK_WORKSTACK');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            await userWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await userWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Team workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'TEAM_WORKSTACK') {
                            return Promise.resolve('MOCK_WORKSTACK');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            await teamWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await teamWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Workflow workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'WORKFLOW_WORKSTACK') {
                            return Promise.resolve('MOCK_WORKSTACK');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            await workflowWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await workflowWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Stage workstack middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'STAGE_WORKSTACK') {
                            return Promise.resolve('MOCK_WORKSTACK');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {
                locals: {}
            };
        });

        it('should create a workstack object on res.locals', async () => {
            await stageWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).toBeDefined();
            expect(res.locals.workstack).toEqual('MOCK_WORKSTACK');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
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