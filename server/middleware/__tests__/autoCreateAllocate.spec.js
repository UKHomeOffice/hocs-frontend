const { autoCreateAllocateBrowser, autoCreateAllocateApi } = require('../autoCreateAllocate.js');
const { actionResponseMiddleware, apiActionResponseMiddleware } = require('../../middleware/action');
const { getFormForAction } = require('../../services/form');
const tenantConfig = require('../../tenantConfig');

jest.mock('../../middleware/action');
jest.mock('../../services/form', () => ({
    getFormForAction: jest.fn((_, _1, next) => {
        next();
    })
}));
jest.mock('../../tenantConfig', () => ({
    layoutConfig: jest.fn(() => ({
        autoCreateAndAllocateEnabled: true
    }))
}));

describe('when the skip middleware is called', () => {

    let req = {};
    let res = {};
    const next = jest.fn();

    beforeEach(() => {
        req = {
            params: {
                workflow: 'create',
                action: 'document'
            }
        };

        jest.clearAllMocks();
    });

    describe('and it is an api request', () => {
        describe('and the skip option is enabled', () => {
            describe('and it is a create case request', () => {
                it('should call the middlewares to get the form and post it', async () => {
                    expect.assertions(4);

                    await autoCreateAllocateApi(req, res, next);

                    expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                    expect(getFormForAction).toHaveBeenCalledTimes(1);
                    expect(apiActionResponseMiddleware).toHaveBeenCalledTimes(1);
                    expect(next).not.toHaveBeenCalled();
                });
            });
            describe('and it is not a create case request', () => {
                it('should only call the next method', async () => {
                    expect.assertions(4);

                    req.params = { workflow: '__workflow__', action: '__action__' };

                    await autoCreateAllocateApi(req, res, next);

                    expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                    expect(getFormForAction).not.toHaveBeenCalled();
                    expect(apiActionResponseMiddleware).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalledWith();
                });
            });
        });
        describe('and the skip option is not enabled', () => {
            it('should only call the next method', async () => {
                expect.assertions(4);

                tenantConfig.layoutConfig.mockImplementationOnce(() => ({ autoCreateAndAllocateEnabled: false }));

                await autoCreateAllocateApi(req, res, next);

                expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                expect(getFormForAction).not.toHaveBeenCalled();
                expect(apiActionResponseMiddleware).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith();
            });
        });
        describe('and there is an error retrieving the config', () => {
            it('should call the next method with the error detail', async () => {
                expect.assertions(4);

                tenantConfig.layoutConfig.mockImplementationOnce(() => Promise.reject('Error').catch(() => {}));

                await autoCreateAllocateApi(req, res, next);

                expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                expect(getFormForAction).not.toHaveBeenCalled();
                expect(apiActionResponseMiddleware).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith('Error');
            });
        });
    });

    describe('and it is a page route', () => {
        describe('and the skip option is enabled', () => {
            describe('and it is a create case request', () => {
                it('should call the middlewares to get the form and post it', async () => {
                    expect.assertions(4);

                    req.params = { workflow: 'create', action: 'document' };

                    await autoCreateAllocateBrowser(req, res, next);

                    expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                    expect(getFormForAction).toHaveBeenCalledTimes(1);
                    expect(actionResponseMiddleware).toHaveBeenCalledTimes(1);
                    expect(next).not.toHaveBeenCalled();
                });
            });
            describe('and it is not a create case request', () => {
                beforeEach(() => {
                    req.params = { workflow: '__workflow__', action: '__action__' };
                });
                it('should only call the next method', async () => {
                    expect.assertions(4);

                    await autoCreateAllocateBrowser(req, res, next);

                    expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                    expect(getFormForAction).not.toHaveBeenCalled();
                    expect(actionResponseMiddleware).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalledWith();
                });
            });
        });
        describe('and the skip option is not enabled', () => {
            it('should only call the next method', async () => {
                expect.assertions(4);

                tenantConfig.layoutConfig.mockImplementationOnce(() => ({ autoCreateAndAllocateEnabled: false }));

                await autoCreateAllocateBrowser(req, res, next);

                expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                expect(getFormForAction).not.toHaveBeenCalled();
                expect(actionResponseMiddleware).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith();
            });
        });
        describe('and there is an error retrieving the config', () => {
            it('should call the next method with the error detail', async () => {
                expect.assertions(4);

                tenantConfig.layoutConfig.mockImplementationOnce(() => Promise.reject('Error').catch(() => {}));

                await autoCreateAllocateBrowser(req, res, next);

                expect(tenantConfig.layoutConfig).toHaveBeenCalledTimes(1);
                expect(getFormForAction).not.toHaveBeenCalled();
                expect(actionResponseMiddleware).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith('Error');
            });
        });
    });
});
