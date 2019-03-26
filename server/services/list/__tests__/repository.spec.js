const { createRepository } = require('../repository');

describe('List Repository', () => {

    describe('createRespository', () => {
        it('should return a repository instance', () => {
            const repository = createRepository();
            expect(repository).toBeDefined();
        });
    });

    describe('hasResource', () => {
        it('should return false when key does not exist in the store', () => {
            const repository = createRepository();
            expect(repository.hasResource('TEST_KEY')).toEqual(false);
        });

        it('should return true when key does exist in the store', () => {
            const repository = createRepository({ TEST_KEY: 'TEST_VALUE' });
            expect(repository.hasResource('TEST_KEY')).toEqual(true);
        });
    });

    describe('store', () => {
        it('should store key/value pairs in the store', () => {
            const repository = createRepository();
            expect(repository.hasResource('TEST_KEY')).toEqual(false);
            repository.store('TEST_KEY', 'TEST_VALUE');
            expect(repository.hasResource('TEST_KEY')).toEqual(true);
        });
    });

    describe('fetch', () => {
        it('should return values for keys that exist', () => {
            const repository = createRepository({ TEST_KEY: 'TEST_VALUE' });
            expect(repository.fetch('TEST_KEY')).toEqual('TEST_VALUE');
        });

        it('should return null for keys that do not exist', () => {
            const repository = createRepository();
            expect(repository.fetch('TEST_KEY')).toEqual(null);
        });
    });

    describe('flush', () => {
        it('should allow key value pairs to be flushed from the store', () => {
            const repository = createRepository({ TEST_KEY: 'TEST_VALUE' });
            expect(repository.fetch('TEST_KEY')).toEqual('TEST_VALUE');
            repository.flush('TEST_KEY');
            expect(repository.fetch('TEST_KEY')).toBeNull();
        });
    });

    describe('flushAll', () => {
        it('should allow for the store to be flushed', () => {
            const repository = createRepository({ FIRST: 1, SECOND: 2 });
            expect(repository.fetch('FIRST')).toEqual(1);
            expect(repository.fetch('SECOND')).toEqual(2);
            repository.flushAll();
            expect(repository.fetch('FIRST')).toBeNull();
        });
    });

});