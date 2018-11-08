jest.mock('../../libs/request.js', () => ({
    infoServiceClient: {
        get: jest.fn(() => Promise.resolve())
    },
    workflowServiceClient: {
        get: jest.fn(() => Promise.resolve())
    },
    caseworkServiceClient: {
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
        dashboard: () => '/test/url',
        workflowTypes: () => '/test/url',
        workflowTypesBulk: () => '/test/url',
        memberList: () => '/test/url',
        ministerList: () => '/test/url',
        caseDocuments: () => '/test/url',
        caseDocumentsType: () => '/test/url',
        standardLines: () => '/test/url',
        templates: () => '/test/url',
        caseTopics: () => '/test/url',
        topicsCaseType: () => '/test/url',
        correspondentTypes: () => '/test/url',
        caseCorrespondents: () => '/test/url',
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

    const { caseworkServiceClient, infoServiceClient, workflowServiceClient } = require('../../libs/request');

    beforeEach(() => {
        jest.resetAllMocks();
        expect(infoServiceClient).toBeDefined();
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

    it('should support the MEMBER_LIST list', async () => {
        const choice = (value, group) => ({ label: `Choice ${value}`, value: `CHOICE_${value}`, group });
        infoServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                members: [
                    choice('A', 'GROUP_A'),
                    choice('B', 'GROUP_A'),
                    choice('C', 'GROUP_B')
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('MEMBER_LIST', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(2);
        expect(list[0].options.length).toEqual(2);
        expect(list[1].options.length).toEqual(1);
    });

    it('should support the CASE_STANDARD_LINES list', async () => {
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                label: 'Test Standard Line',
                value: '1234'
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_STANDARD_LINES', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(1);
    });

    it('should support the CASE_TEMPLATES list', async () => {
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                label: 'Test Template',
                value: '1234'
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_TEMPLATES', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(1);
    });

    it('should support the TOPICS_CASETYPE list', async () => {
        const group = (label, options) => ({ label, options });
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                parentTopics: [
                    group('First group', [
                        choice('A'),
                        choice('B'),
                        choice('C')
                    ])]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('TOPICS_CASETYPE', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(1);
        expect(list[0].options.length).toEqual(3);
    });

    it('should support the CASE_TOPICS list', async () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        workflowServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                topics: [
                    choice('A'),
                    choice('B'),
                    choice('C')
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_TOPICS', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

    it('should support the CORRESPONDENT_TYPES list', async () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        infoServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                correspondentTypes: [
                    choice('A'),
                    choice('B'),
                    choice('C')
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CORRESPONDENT_TYPES', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

    it('should support the CASE_CORRESPONDENTS list', async () => {
        const choice = value => ({ label: `Choice ${value}`, value: `CHOICE_${value}` });
        caseworkServiceClient.get.mockImplementation(jest.fn(() => Promise.resolve({
            data: {
                correspondents: [
                    choice('A'),
                    choice('B'),
                    choice('C')
                ]
            }
        })));
        const listService = require('../list');
        const { getList } = listService;
        const list = await getList('CASE_CORRESPONDENTS', { user: { roles: [] } });
        expect(list).toBeDefined();
        expect(list.length).toEqual(3);
    });

});

describe('List service', () => {





});