/**
 * @jest-environment node
 */
const {
    somuApiResponseMiddleware,
    getSomuItem
} = require('./../somu');

jest.mock('../../clients', () => ({
    caseworkService: {
        get: jest.fn(() => Promise.resolve()),
        post: jest.fn(() => Promise.resolve())
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
            clients.caseworkService.post.mockReset();
            res.status = jest.fn(() => ({ json }));
        });

        it('should send a 200/OK response and a callback URL', async () => {
            clients.caseworkService.post.mockImplementation(() => {
                return Promise.resolve();
            });

            await somuApiResponseMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith({ redirect: '/case/CASE_ID/stage/STAGE_ID' });
        });

        it('should create an ErrorModel instance on the response object if the call to Action Service fails', async () => {
            const mockError = new Error('TEST_ERROR');
            clients.caseworkService.post.mockImplementation(() => {
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
        const data = '{ "Test": "TestVal" }';

        beforeEach(() => {
            clients.caseworkService.get.mockReset();
        });

        it('should return undefined if there is no match in the data object with passed in somuItemUuid', async () => {
            clients.caseworkService.get.mockImplementation(() => Promise.resolve( { data: {} }));

            const result = await getSomuItem({ somuTypeUuid, caseId, user, somuItemUuid });
            expect(result).toBeUndefined();
        });

        it('should return the item if the uuid is the same as one passed in', async () => {
            clients.caseworkService.get.mockImplementation(() => Promise.resolve( { data: { uuid: 'SOMU_ITEM_ID', data: data } }));

            const result = await getSomuItem({ somuTypeUuid, caseId, user, somuItemUuid });
            expect(result).toEqual(JSON.parse(data));
        });
    });
});
