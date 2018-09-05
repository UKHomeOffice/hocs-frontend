import { workstackMiddleware, workstackApiResponseMiddleware } from '../workstack.js';

const mockCaseworkSeviceClient = jest.fn();
jest.mock('../../libs/request.js', () => {
    return {
        caseworkServiceClient: {
            get: (url) => {
                mockCaseworkSeviceClient(url);
                return Promise.resolve({
                    data: { activeStages: 'WORKSTACK_DATA' }
                });
            }
        }
    };
});

describe('Workstack middleware', () => {

    let req = {};
    let res = {};
    const next = jest.fn();

    beforeEach(() => {
        req = {};
        res = { locals: {} };
        next.mockReset();
    });

    it('should call the caseworkServiceClient and attach workstack data to the response object', async () => {
        await workstackMiddleware(req, res, next);
        expect(mockCaseworkSeviceClient).toHaveBeenCalled();
        expect(mockCaseworkSeviceClient).toHaveBeenLastCalledWith('/stage/active');
        expect(next).toHaveBeenCalled();
        expect(res.locals).toBeDefined();
        expect(res.locals.workstack).toBeDefined();
        expect(res.locals.workstack).toEqual('WORKSTACK_DATA');
    });

});

describe('Workstack AJAX response middleware', () => {

    let req = {};
    let res = {};
    const json = jest.fn();

    beforeEach(() => {
        req = {};
        res = {
            json,
            locals: {
                workstack: 'WORKSTACK_DATA'
            }
        };
        json.mockReset();
    });

    it('should return the workstack object from the response object', () => {
        workstackApiResponseMiddleware(req, res);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenLastCalledWith('WORKSTACK_DATA');
    });
});