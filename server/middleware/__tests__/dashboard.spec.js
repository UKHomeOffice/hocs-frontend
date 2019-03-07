const {
    dashboardMiddleware
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
            req = { form: { meta: {} } };
            res = {};
        });

        it('should create a dashboard object on res.locals', async () => {
            listService.getList.mockImplementation(() => Promise.resolve('MOCK_DASHBOARD'));
            await dashboardMiddleware(req, res, next);
            expect(req.form.meta.dashboard).toBeDefined();
            expect(req.form.meta.dashboard).toEqual('MOCK_DASHBOARD');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve dashboard data', async () => {
            listService.getList.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await dashboardMiddleware(req, res, next);
            expect(req.form.meta.dashboard).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

});