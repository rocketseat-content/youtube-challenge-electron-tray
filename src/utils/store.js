const Store = require('electron-store');

module.exports = {
    store: null,

    create: function () {
        this.store = new Store({
            projects: {
                type: 'string'
            }
        })
    },

    set: function (key, data) {
        this.store.set(key, JSON.stringify(data));
    },

    get: function (key) {
        const data = this.store.get(key);
        return data ? JSON.parse(data) : [];
    },
}