const {
    userWorkstackMiddleware,
    teamWorkstackMiddleware,
    workflowWorkstackMiddleware,
    stageWorkstackMiddleware,
    workstackApiResponseMiddleware,
    allocateNextCaseToUser,
    getMoveTeamOptions,
    handleWorkstackSubmit
} = require('../workstack');

let req = {};
let res = {};
const next = jest.fn();


const { caseworkService, workflowService } = require('../../clients');

jest.mock('../../clients', () => ({
    caseworkService: {
        put: jest.fn()
    },
    workflowService: {
        put: jest.fn()
    }
}));


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
                },
                user: { uuid: 'TEST' }
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

        it('should call next with an error if user not present', async () => {
            const reqWithoutUser = req;
            delete reqWithoutUser.user;

            await userWorkstackMiddleware(reqWithoutUser, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(TypeError('Cannot read properties of undefined (reading \'uuid\')'));
        });

        it('should call next with an error if unable to retrieve workstack data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await userWorkstackMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Allocate next case middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                params: {
                    teamId: '1234'
                },
                user: {}
            };
        });

        it('should create a stage object on res.locals', async () => {
            res = {
                locals: {
                    stage: {
                        data: {
                            caseUUID: '12345',
                            uuid: '89765'
                        }
                    }
                }
            };
            await allocateNextCaseToUser(req, res, next);
            expect(res.locals.stage).toBeDefined();
            expect(res.locals.stage).toEqual(
                {
                    data: {
                        caseUUID: '12345',
                        uuid: '89765'
                    }
                }
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('workstack submit case update (allocate/move team)', () => {
        const expectedHeaders = {
            'headers': {
                'X-Auth-Groups': 'some_groups',
                'X-Auth-Roles': 'some_roles',
                'X-Auth-UserId': 'userUuid',
                'X-Correlation-Id': '00000000-0000-0000-0000-000000000000'
            }
        };

        beforeEach(() => {
            next.mockReset();
            res = {};

            req = {
                user: {
                    uuid: 'userUuid',
                    roles: { join: () => 'some_roles' },
                    groups: { join: () => 'some_groups' }
                },
                requestId: '00000000-0000-0000-0000-000000000000'
            };

            caseworkService.put.mockClear();
            workflowService.put.mockClear();
        });

        it('should invoke the caseservice to allocate cases to a team member', async () => {
            req.body = {
                'selected_user': 'test_user',
                'submitAction': 'allocate_to_team_member',
                'selected_cases': [
                    'uuid1:uuid2',
                    'uuid3:uuid4'
                ]
            };

            await handleWorkstackSubmit(req, res, next);

            expect(caseworkService.put.mock.calls[0])
                .toEqual(['/case/uuid1/stage/uuid2/user', { 'userUUID': 'test_user' }, expectedHeaders]);

            expect(caseworkService.put.mock.calls[1])
                .toEqual(['/case/uuid3/stage/uuid4/user', { 'userUUID': 'test_user' }, expectedHeaders]);

            expect(next).toBeCalled();
        });

        it('should invoke the caseservice to move cases to the correct team', async () => {
            req.body = {
                'selected_team': 'test_team',
                'submitAction': 'move_team',
                'selected_cases': [
                    'uuid1:uuid2',
                    'uuid3:uuid4'
                ]
            };

            await handleWorkstackSubmit(req, res, next);

            expect(workflowService.put.mock.calls[0])
                .toEqual(['/case/uuid1/stage/uuid2/CaseworkTeamUUID', { 'value': 'test_team' }, expectedHeaders]);

            expect(workflowService.put.mock.calls[1])
                .toEqual(['/case/uuid3/stage/uuid4/CaseworkTeamUUID', { 'value': 'test_team' }, expectedHeaders]);

            expect(caseworkService.put.mock.calls[0])
                .toEqual(['/case/uuid1/stage/uuid2/team', { 'teamUUID': 'test_team' }, expectedHeaders]);

            expect(caseworkService.put.mock.calls[1])
                .toEqual(['/case/uuid3/stage/uuid4/team', { 'teamUUID': 'test_team' }, expectedHeaders]);

            expect(next).toBeCalled();
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

    describe('Get Move Team Options', () => {
        const mockTeamsResponse = [{ 'team_object': 'team' }];

        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'MOVE_TEAM_OPTIONS') {
                            return Promise.resolve(mockTeamsResponse);
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {
                locals: {
                    workstack: {}
                }
            };
        });

        it('should get the move team options from the info service', async () => {
            await getMoveTeamOptions(req, res, next);
            expect(res.locals.workstack.moveTeamOptions).toEqual(mockTeamsResponse);
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
