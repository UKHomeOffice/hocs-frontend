const listService = require('../service');
const User = require('../../../models/user');
const getLogger = require('../../../libs/logger');

jest.mock('../../../libs/logger', () => jest.fn().mockReturnValue({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
}));


describe('List Service', () => {

    const mockUUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    const mockUser = new User({
        uuid: mockUUID
    });

    describe('initialise', () => {
        it('should return an instance when initialised', async () => {
            listService.initialise();
            const instance = await listService.getInstance();
            expect(instance).toBeDefined();
        });
    });

    describe('fetchStaticList', () => {
        it ('should return value with key', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: 'test', value: 'TEST_VALUE' }]
                }
            };

            listService.initialise(lists);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.getFromStaticList('test_static', 'test');

            expect(result).toBeDefined();
            expect(result).toEqual('TEST_VALUE');
        });

        it ('should return null if pair array against non array key', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: ['test_1', 'test_2'], value: 'TEST_VALUE' }]
                }
            };

            listService.initialise(lists);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.getFromStaticList('test_static', 'test');

            expect(result).toBeNull();
        });

        it ('should return value when both arrays are present with correct keys', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: ['test_1', 'test_2'], value: 'TEST_VALUE' }]
                }
            };

            listService.initialise(lists);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.getFromStaticList('test_static', ['test_1', 'test_2']);

            expect(result).toBeDefined();
            expect(result).toEqual('TEST_VALUE');
        });

        it ('should return null when only partial array key match ', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: ['test_1', 'test_2'], value: 'TEST_VALUE' }]
                }
            };

            listService.initialise(lists);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.getFromStaticList('test_static', ['test_1', 'test_this_is_not_present']);

            expect(result).toBeNull();
        });

        it ('should return value if value matches inputted key and key not in data', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ value: 'TEST_VALUE', label: 'TEST' }]
                }
            };

            listService.initialise(lists);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.getFromStaticList('test_static', 'TEST_VALUE');

            expect(result).toBeDefined();
            expect(result).toEqual('TEST');
        });
    });

    describe('fetchList', () => {
        it('should support configured lists', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api'
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'test',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual(mockResponse);
        });

        it('should return null on failure', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api'
                }
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.reject({ response: { status: 500 } }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            await expect(instance.fetch('test')).rejects.toThrow('Unable to fetch list');
        });

        it('should transform the response with an adapter if supplied', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: (data) => data.map(({ first, second }) => ({ a: first, b: second }))
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'test',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [{ first: 1, second: 2 }];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual([{ a: 1, b: 2 }]);
        });

        it('should return null if the supplied adapter fails', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: () => { throw new Error('Failed to apply adapter'); }
                }
            };

            const mockResponse = [{ first: 1, second: 2 }];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            await expect(instance.fetch('test')).rejects.toThrow('Unable to fetch list');
        });

        it('should cache static lists on initialisation', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC
                }
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: [] }))
                }
            };

            await listService.initialise(lists, clients);

            expect(clients.test.get).toHaveBeenCalled();
            expect(clients.test.get).toHaveBeenCalledTimes(1);
        });

        it('should fetch static lists on initialisation', async () => {
            const mockData = [{ first: 1 }, { second: 2 }];

            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: mockData
                }
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: [] }))
                }
            };

            await listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');
            expect(clients.test.get).not.toHaveBeenCalled();
            expect(result).toEqual(mockData);
        });

        xit('should return the cached static list when available', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC
                }
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: [] }))
                }
            };

            await listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(clients.test.get).toHaveBeenCalled();
            expect(clients.test.get).toHaveBeenCalledTimes(1);
            expect(result).toBeDefined();
        });

        xit('should fetch and store a static list on a cache miss', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC
                }
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.reject({ response: { status: 503 } }))
                }
            };

            await listService.initialise(lists, clients);
            listService.flush('test');
            const instance = await listService.getInstance(mockUUID, mockUser);

            clients.test.get.mockImplementation(() => Promise.resolve({ data: [] }));

            const result1 = await instance.fetch('test');
            expect(clients.test.get).toHaveBeenCalled();
            expect(clients.test.get).toHaveBeenCalledTimes(2);
            expect(result1).toBeDefined();

            const result2 = await instance.fetch('test');
            expect(clients.test.get).toHaveBeenCalledTimes(2);
            expect(result2).toBeDefined();
        });

        it('should return null when a list is requested that is not implemented', async () => {
            const lists = {
            };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve())
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            await expect(instance.fetch('test')).rejects.toThrow('Unable to fetch list');
        });

        it('should supply a "fromStaticList" utility method to adapters to fetch values from static lists', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: 'TEST_KEY', value: 'TEST_VALUE' }]
                },
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: async (data, { fromStaticList }) => {
                        expect(fromStaticList).toBeDefined();
                        expect(typeof fromStaticList).toEqual('function');

                        const result = await fromStaticList('test_static', 'TEST_KEY');

                        expect(result).toBeDefined();
                        expect(result).toEqual('TEST_VALUE');
                        return data;
                    }
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'test',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual(mockResponse);
        });

        it('should supply a configuration object to adapters', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: 'TEST_KEY', value: 'TEST_VALUE' }]
                },
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: async (data, { configuration }) => {
                        expect(configuration).toBeDefined();
                        expect(typeof configuration).toEqual('object');
                        expect(configuration.systemName).toBeDefined();
                        expect(configuration.systemName).toEqual('system');
                        return data;
                    }
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'config',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [];

            const mockConfigResponse = { systemName: 'system' };

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                },
                config: {
                    get: jest.fn(() => Promise.resolve({ data: mockConfigResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual(mockResponse);
        });

        it('should return null from "fromStaticList" when invalid list passed', async () => {
            const lists = {
                test_static: {
                    client: 'test',
                    endpoint: '/test/api',
                    type: listService.types.STATIC,
                    data: [{ key: 'TEST_KEY', value: 'TEST_VALUE' }]
                },
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: async (data, { fromStaticList }) => {
                        expect(fromStaticList).toBeDefined();
                        expect(typeof fromStaticList).toEqual('function');

                        const result = await fromStaticList('test_static', 'INVALID_KEY');

                        expect(result).toBeNull();
                        return data;
                    }
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'test',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual(mockResponse);
        });

        it('should return null from "fromStaticList" when invalid key passed', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api',
                    adapter: async (data, { fromStaticList }) => {
                        expect(fromStaticList).toBeDefined();
                        expect(typeof fromStaticList).toEqual('function');

                        const result = await fromStaticList('test_invalid_static', 'TEST_KEY');

                        expect(result).toBeNull();
                        return data;
                    }
                },
                S_SYSTEM_CONFIGURATION: {
                    client: 'test',
                    endpoint: '/configuration/api'
                }
            };

            const mockResponse = [];

            const clients = {
                test: {
                    get: jest.fn(() => Promise.resolve({ data: mockResponse }))
                }
            };

            listService.initialise(lists, clients);
            const instance = await listService.getInstance(mockUUID, mockUser);
            const result = await instance.fetch('test');

            expect(result).toBeDefined();
            expect(result).toEqual(mockResponse);
        });
    });

    describe('when the flush method is called but retreival of new data fails', () => {
        it('should call not call flush or store on the respository', async () => {
            const listKey = '__listKey__';

            const mockRepositoryFlush = jest.fn();
            const mockRepositoryStore = jest.fn();
            const mockRepositoryFetch = jest.fn();
            const mockClientInstance = jest.fn();
            mockClientInstance.get = mockGet;
            mockRepositoryFetch.mockReturnValue(mockClientInstance);
            const mockGet = jest.fn();
            mockGet.mockImplementation(() => {
                throw new Error('400');
            });

            await listService.initialise({}, {}, { listRepository: { 
                flush: mockRepositoryFlush, 
                fetch: mockRepositoryFetch, 
                store: mockRepositoryStore 
            }});

            await listService.flush(listKey);

            expect(getLogger).toHaveBeenCalled();
            expect(mockRepositoryFlush).not.toHaveBeenCalled();
            expect(mockRepositoryStore).not.toHaveBeenCalled();
        });
    });

    describe('when the flush method is called and retreival of new data is successful', () => {
        it('should call call flush and store on the repository', async () => {
            const listKey = '__listKey__';

            const mockRepositoryFlush = jest.fn();
            const mockRepositoryStore = jest.fn();
            const mockRepositoryFetch = jest.fn();
            const mockGet = jest.fn();
            mockGet.mockReturnValue(JSON.parse('{"client": "newclient"}'));

            const mockClientInstance = jest.fn();
            mockClientInstance.get = mockGet;
            mockRepositoryFetch.mockReturnValue(mockClientInstance);

            await listService.initialise({}, {}, { listRepository: { 
                flush: mockRepositoryFlush, 
                fetch: mockRepositoryFetch, 
                store: mockRepositoryStore 
            } });
            const mockAdapter = jest.fn();
            listService.applyAdapter = mockAdapter;

            await listService.flush(listKey);

            expect(getLogger).toHaveBeenCalled();
            expect(mockRepositoryStore).toHaveBeenCalled();
            expect(mockRepositoryFlush).toHaveBeenCalledWith(listKey);
        });
    });
});
