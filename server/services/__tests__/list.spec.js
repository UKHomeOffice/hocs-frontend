jest.mock('../../libs/request.js', () => ({
    workflowServiceClient: {
        get: jest.fn(() => Promise.resolve())
    }
}));

jest.mock('../../models/user.js', () => ({
    hasRole: () => true
}));

jest.mock('../../config', () => ({
    forContext: () => ({
        DOCUMENT_WHITELIST: ['1', '2', '3']
    })
}));

describe('List service', () => {

    const { workflowServiceClient } = require('../../libs/request');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call initialise and retrieve defined lists', async () => {
        const listService = require('../list');
        const { initialise } = listService;
        await initialise();
        expect(workflowServiceClient.get).toHaveBeenCalled();
        expect(workflowServiceClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle failure to retrieve list', async () => {
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.reject()));
        const { initialise } = require('../list');
        await initialise();
        expect(workflowServiceClient.get).toHaveBeenCalled();
        expect(workflowServiceClient.get).toHaveBeenCalledTimes(1);
    });

    it('should expose a getList method', () => {
        const listService = require('../list');
        expect(listService).toBeDefined();
        expect(listService.getList).toBeDefined();
    });

});

describe('getList', () => {

    const { workflowServiceClient } = require('../../libs/request');

    beforeEach(() => {
        jest.resetAllMocks();
        expect(workflowServiceClient).toBeDefined();
    });

    it('should throw when called with incorrect parameters', async () => {
        const listService = require('../list');
        const { getList, initialise } = listService;
        await initialise();
        expect(getList()).rejects.toBeDefined();
        expect(getList('UNSUPPORTED_LIST')).rejects.toBeDefined();
    });

    it('should support the CASE_TYPES list', async () => {
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                workflowTypes: ['1', '2', '3']
            }
        })));
        const listService = require('../list');
        const { getList, initialise } = listService;
        await initialise();
        const list = await getList('CASE_TYPES', { user: {} });
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

    it('should support the DOCUMENT_EXTENSION_WHITELIST list', async () => {
        const listService = require('../list');
        const { getList, initialise } = listService;
        await initialise();
        const list = await getList('DOCUMENT_EXTENSION_WHITELIST');
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

});

describe('List service', () => {





});