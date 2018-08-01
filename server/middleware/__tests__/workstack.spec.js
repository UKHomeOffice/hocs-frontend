import { workstackMiddleware, workstackAjaxResponseMiddleware } from '../workstack.js';

const mockCaseworkSeviceClient = jest.fn();
jest.mock('../../libs/request.js', () => {
    return {
        caseworkServiceClient: {
            get: (url) => {
                mockCaseworkSeviceClient(url);
                return Promise.resolve({
                    data: 'WORKSTACK_DATA'
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
        res = {};
        next.mockReset();
    });

    it('should call the caseworkServiceClient and attach workstack data to the response object', async () => {
        await workstackMiddleware(req, res, next);
        expect(mockCaseworkSeviceClient).toHaveBeenCalled();
        expect(mockCaseworkSeviceClient).toHaveBeenLastCalledWith('/case/active');
        expect(next).toHaveBeenCalled();
        expect(res.data).toBeDefined();
        expect(res.data.workstack).toBeDefined();
        expect(res.data.workstack).toEqual('WORKSTACK_DATA');
    });

});

describe('Workstack AJAX response middleware', () => {

    let req = {};
    let res = {};
    const send = jest.fn();

    beforeEach(() => {
        req = {};
        res = {
            send,
            data: {
                workstack: 'WORKSTACK_DATA'
            }
        };
        send.mockReset();
    });

    it('should return the workstack object from the response object', () => {
        workstackAjaxResponseMiddleware(req, res);
        expect(res.send).toHaveBeenCalled();
        expect(res.send).toHaveBeenLastCalledWith('WORKSTACK_DATA');
    });
});