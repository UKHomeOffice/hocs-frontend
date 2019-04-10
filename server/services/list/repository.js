function createRepository(defaultStore = {}) {

    let store = defaultStore;

    return {
        store: function (key, data) {
            if(data != null) {
                if(data.constructor !== Array || (data.constructor === Array && data.length > 0)) {
                    store[key] = data;
                }
            }
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