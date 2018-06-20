const forms = require('../forms/index');

const actions = {
    create: () => {
        return forms.caseType;
    },
    submit: () => {
        return forms.create;
    },
    dcu_min: () => {
        return forms.create;
    }
};

const getForm = (action, options) => {
    try {
        return actions[action.toLowerCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get form for ${action}`);
    }
};

module.exports = {
    getForm
};