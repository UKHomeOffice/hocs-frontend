const listService = require('../service');
const User = require('../../../models/user');

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

    describe('fetchList', () => {
        it('should support configured lists', async () => {
            const lists = {
                test: {
                    client: 'test',
                    endpoint: '/test/api'
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

});