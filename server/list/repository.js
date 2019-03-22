function createRepository(defaultStore = {}) {

    let store = defaultStore;

    return {
        store: function (key, data) {
            store[key] = data;
        },
        fetch: function (key) {
            if (store.hasOwnProperty(key)) {
                return store[key];
            } else {
                return null;
            }
        },
        hasResource: function (key) {
            return store.hasOwnProperty(key);
        },
        flushAll: function () { store = {}; },
        flush: function (key) {
            if (store.hasOwnProperty(key)) {
                delete store[key];
            }
        }
    };

}

module.exports = {
    createRepository
};