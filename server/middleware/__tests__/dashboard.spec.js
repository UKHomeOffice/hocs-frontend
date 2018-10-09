const {
    dashboardMiddleware,
    dashboardApiResponseMiddleware
} = require('../dashboard');

jest.mock('../../services/list', () => ({
    getList: jest.fn()
}));

let req = {};
let res = {};
const next = jest.fn();
const listService = require('../../services/list');

describe('Dashboard middleware', () => {

    describe('Dashboard middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {};
            res = {
                locals: {}
            };
        });

        it('should create a dashboard object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_DASHBOARD'));
            await dashboardMiddleware(req, res, next);
            expect(res.locals.dashboard).toBeDefined();
            expect(res.locals.dashboard).toEqual('MOCK_DASHBOARD');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve dashboard data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await dashboardMiddleware(req, res, next);
            expect(res.locals.workstack).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

    describe('Workstack API response.middleware', () => {

        beforeEach(() => {
            req = {};
            res = {
                locals: { dashboard: 'MOCK_DASHBOARD' },
                json: jest.fn()
            };
        });

        it('should send the dashboard data from res.locals', () => {
            dashboardApiResponseMiddleware(req, res);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith('MOCK_DASHBOARD');
        });
    });
});