const {
    dashboardMiddleware
} = require('../dashboard');

let req = {};
let res = {};
const next = jest.fn();

describe('Dashboard middleware', () => {

    describe('Dashboard middleware', () => {
        beforeEach(() => {
            next.mockReset();
            req = {
                form: {
                    meta: {}
                },
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'DASHBOARD') {
                            return Promise.resolve('MOCK_DASHBOARD');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = {};
        });

        it('should create a dashboard object on res.locals', async () => {
            await dashboardMiddleware(req, res, next);
            expect(req.form.meta.dashboard).toBeDefined();
            expect(req.form.meta.dashboard).toEqual('MOCK_DASHBOARD');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with an error if unable to retrieve dashboard data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR'));
            await dashboardMiddleware(req, res, next);
            expect(req.form.meta.dashboard).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });
    });

});