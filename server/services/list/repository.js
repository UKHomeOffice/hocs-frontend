function createRepository(defaultStore = {}) {

    let store = defaultStore;

    return {
        store: function (key, data) {
            if((data && data.constructor !== Array)|| (data && data.constructor === Array && data.length > 0)) {
                store[key] = data;
            }
        },
        fetch: function (key) {
            if(Object.prototype.hasOwnProperty.call(store, key)) {
                return store[key];
            } else {
                return null;
            }
        },
        hasResource: function (key) {
            return Object.prototype.hasOwnProperty.call(store, key);
        },
        flushAll: function () { store = {}; },
        flush: function (key) {
            if (Object.prototype.hasOwnProperty.call(store, key)) {
                delete store[key];
            }
        }
    };

}

module.exports = {
    createRepository
};
