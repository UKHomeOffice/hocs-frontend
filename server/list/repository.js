function createRepository(defaultStore = {}) {

    const store = defaultStore;

    return {
        store: function (key, data) {
            store[key] = { data };
        },
        fetch: function (key) {
            if (store.hasOwnProperty(key)) {
                return (({ data }) => data)(store[key]);
            } else {
                return null;
            }
        },
        hasResource: function (key) {
            return store.hasOwnProperty(key);
        }
    };

}

module.exports = {
    createRepository
};