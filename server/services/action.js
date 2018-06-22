const actions = {
    create: (data) => {
        // TODO: Post to create case
        const stage = 'create';
        return {
            callbackUrl: `/case/${data['case-type']}/${stage}`
        }
    },
    submit: (data) => {
        // TODO: Post to persist case
        return {
            callbackUrl: '/'
        }
    }
};

const performAction = (action, data) => {
    try {
        return actions[action.toLowerCase()].call(this, data);
    } catch (e) {
        throw new Error(`Unable to perform action ${action}`);
    }
};

module.exports = {
    performAction
};