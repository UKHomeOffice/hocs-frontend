import { workstackMiddleware, apiWorkstackMiddleware } from '../workstack.js';

const mockCaseworkSeviceClient = jest.fn();
jest.mock('../../libs/request.js', () => {
    return {
        caseworkServiceClient: {
            get: jest.fn((url) => {
                mockCaseworkSeviceClient(url);
                return Promise.resolve({
                    data: { activeStages: 'WORKSTACK_DATA' }
                });
            })
        }
    };
});

describe('Workstack middleware', () => {

    const send = jest.fn();
    const status = jest.fn(() => ({
        send: send
    }));
    const next = jest.fn();
    let req, res;

    beforeEach(() => {
        next.mockReset();
        status.mockReset();
        send.mockReset();
        req = {};
        res = { status, locals: {} };
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

    it('should return a 500 and error if the request fails', () => {
        const { caseworkServiceClient } = require('../../libs/request');
        caseworkServiceClient.get.mockImplementation(() => (
            Promise.reject()
        ));
        workstackMiddleware(req, res, next)
            .then(() => { throw Error('SHOULD_CATCH'); })
            .catch(e => {
                expect(e).toBeDefined();
                expect(e).toBeInstanceOf(Error);
            });
    });
});

describe('Workstack API response middleware', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const mockPipe = jest.fn();

    beforeEach(() => {
        next.mockReset();
        mockPipe.mockReset();
    });

    it('should return the workstack object from the response object', async () => {
        const { caseworkServiceClient } = require('../../libs/request');
        caseworkServiceClient.get.mockImplementation(() => (
            Promise.resolve({
                data: {
                    pipe: mockPipe
                }
            })
        ));
        await apiWorkstackMiddleware(req, res);
        expect(mockPipe).toHaveBeenCalled();
        expect(mockPipe).toHaveBeenCalledWith(res);
    });

    it('should return a 500 and error if the request fails', () => {
        const { caseworkServiceClient } = require('../../libs/request');
        caseworkServiceClient.get.mockImplementation(() => (
            Promise.reject()
        ));
        apiWorkstackMiddleware(req, res)
            .then(() => { throw Error('SHOULD_CATCH'); })
            .catch(e => {
                expect(e).toBeDefined();
                expect(e).toBeInstanceOf(Error);
            });
    });
});