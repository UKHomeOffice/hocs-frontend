const {
    somuApiResponseMiddleware,
    getSomuItem
} = require('./../somu');

jest.mock('../../services/action.js', () => {
    return {
        performAction: jest.fn()
    };
});
const actionService = require('../../services/action');

jest.mock('../../clients', () => ({
    caseworkService: {
        get: jest.fn(() => Promise.resolve({ body: {} }))
    }
}));
const clients = require('../../clients');

describe('Somu middleware', () => {

    describe('somuApiResponseMiddleware', () => {
        let req = {};
        let res = {};
        const next = jest.fn();
        const json = jest.fn();

        beforeEach(() => {
            req = {
                form: {
                    data: { dummy: 'value' },
                    errors: {}
                },
                params: {
                    caseId: 'CASE_ID',
                    stageId: 'STAGE_ID',
                    somuTypeUuid: 'SOMU_TYPE_ID'
                },
                user: {
                    id: 'test',
                    roles: [],
                    groups: []
                },
                body: {}
            };
            res = { };
            next.mockReset();
            json.mockReset();
            actionService.performAction.mockReset();
            clients.caseworkService.get.mockReset();
            res.status = jest.fn(() => ({ json }));
        });

        it('should send a 200/OK response and a callback URL', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should send an 200/OK response even if somuItems.data is not an array', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: { data: '{"test":1}' } });
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should send an 200/OK response even if no data is returned', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ });
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should send an 200/OK response even if somuItem.data is invalid JSON', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: { data: '{' } });
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should return the original item back if somuItem.data is an array', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ data: '[{"test":1}]' }] });
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(actionService.performAction).toHaveBeenCalled();
            expect(actionService.performAction).toHaveBeenCalledWith(
                'CASE',
                expect.objectContaining({
                    'caseId': 'CASE_ID',
                    'somuTypeItems': expect.stringMatching(/.*?test.*?/)
                })
            );
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should update the item in the list if the somuItemUuid param matches', async () => {
            req = { ...req, body: { somuItemUuid: 'SOMU_ITEM_ID' } };
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ uuid: 'SOMU_ITEM_ID', data: '{"blah":"test"}' }] });
            });
            req.params['somuItemUuid'] = 'SOMU_ITEM_ID';
            await somuApiResponseMiddleware(req, res, next);
            expect(actionService.performAction).toHaveBeenCalled();
            expect(actionService.performAction).toHaveBeenCalledWith(
                'CASE',
                expect.objectContaining({
                    'caseId': 'CASE_ID',
                    'somuTypeItems':  '[{"uuid":"SOMU_ITEM_ID","data":{"dummy":"value"}}]'
                })
            );
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should append new item at the end of the list if the somuItemUuid param does not match', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ uuid: 'SOMU_ITEM_ID', data: '{"blah":"test"}' }] });
            });
            req.params['somuItemUuid'] = 'def';
            await somuApiResponseMiddleware(req, res, next);
            expect(actionService.performAction).toHaveBeenCalled();
            expect(actionService.performAction).toHaveBeenCalledWith(
                'CASE',
                expect.objectContaining({
                    'caseId': 'CASE_ID',
                    'somuTypeItems': '[{"uuid":"SOMU_ITEM_ID","data":{"blah":"test"}},{"data":{"dummy":"value"}}]'
                })
            );
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should append new item at the end of the list if no somuItemUuid param present', async () => {
            actionService.performAction.mockImplementation(() => {
                return { callbackUrl: '/' };
            });
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ uuid: 'SOMU_ITEM_ID', data: '{"blah":"test"}' }] });
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(actionService.performAction).toHaveBeenCalled();
            expect(actionService.performAction).toHaveBeenCalledWith(
                'CASE',
                expect.objectContaining({
                    'caseId': 'CASE_ID',
                    'somuTypeItems': '[{"uuid":"SOMU_ITEM_ID","data":{"blah":"test"}},{"data":{"dummy":"value"}}]'
                })
            );
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/' });
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const mockError = new Error('TEST_ERROR');
            actionService.performAction.mockImplementation(() => {
                return Promise.reject(mockError);
            });
            await somuApiResponseMiddleware(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getSomuItem', () => {
        const user = {
            id: 'test',
            roles: [],
            groups: []
        };
        const somuItemUuid = 'SOMU_ITEM_ID';
        const caseId = 'CASE_ID';
        const somuTypeUuid = 'SOMU_TYPE_ID';

        it('should return undefined if there is no match in the data object with passed in somuItemUuid', async () => {
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ uuid: 'SOMU_ITEM_ID2', data: null }] });
            });
            const result = await getSomuItem({ somuTypeUuid, caseId, user, somuItemUuid });
            expect(result).toBeUndefined();
        });

        it('should return the item if the uuid is the same as one passed in', async () => {
            clients.caseworkService.get.mockImplementation(() => {
                return Promise.resolve({ data: [{ uuid: 'SOMU_ITEM_ID', data: null }] });
            });
            const result = await getSomuItem({ somuTypeUuid, caseId, user, somuItemUuid });
            expect(result).toBeDefined();
            expect(result).toEqual({ uuid: 'SOMU_ITEM_ID', data: null, deleted: undefined });
        });
    });
});
