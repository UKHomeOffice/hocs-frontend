jest.mock('../../libs/request.js', () => ({
    infoServiceClient: {
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

jest.mock('../../services/lists/index.js', () => ({
    listDefinitions: {
        workflowTypes: '/test/url',
        workflowTypesBulk: '/test/url'
    },
    staticListDefinitions: {
        test: '/test/url'
    }
}));

describe('List service', () => {

    const { infoServiceClient } = require('../../libs/request');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call initialise and retrieve defined lists', async () => {
        const listService = require('../list');
        const { initialise } = listService;
        await initialise();
        expect(infoServiceClient.get).toHaveBeenCalled();
        expect(infoServiceClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle failure to retrieve list', async () => {
        infoServiceClient.get.mockImplementation(jest.fn(() => Promise.reject()));
        const { initialise } = require('../list');
        await initialise();
        expect(infoServiceClient.get).toHaveBeenCalled();
        expect(infoServiceClient.get).toHaveBeenCalledTimes(1);
    });

    it('should expose a getList method', () => {
        const listService = require('../list');
        expect(listService).toBeDefined();
        expect(listService.getList).toBeDefined();
    });

});

describe('getList', () => {

    const { infoServiceClient } = require('../../libs/request');

    beforeEach(() => {
        jest.resetAllMocks();
        expect(infoServiceClient).toBeDefined();
    });

    it('should throw when called with incorrect parameters', async () => {
        const listService = require('../list');
        const { getList, initialise } = listService;
        await initialise();
        expect(getList()).rejects.toBeDefined();
        expect(getList('UNSUPPORTED_LIST')).rejects.toBeDefined();
    });

    it('should support the CASE_TYPES list', async () => {
        infoServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                caseTypes: [
                    { label: 'A' },
                    { label: 'B' },
                    { label: 'C' }
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_TYPES', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

    it('should support the CASE_TYPES_BULK list', async () => {
        infoServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                caseTypes: [
                    { label: 'A' },
                    { label: 'B' },
                    { label: 'C' }
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_TYPES_BULK', { user: { roles: [] } });
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