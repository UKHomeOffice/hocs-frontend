const actions = {
    create: (data) => {
        // Call case service
        const stage = 'create';
        return {
            callbackUrl: `/case/${data['case-type']}/${stage}`
        }
    },
    submit: (data) => {
        // Call case service
        return {
            callbackUrl: '/'
        }
    }
};

const performAction = (action, data) => {
    try {
        return actions[action.toLowerCase()].call(this, data);
    } catch (e) {
        throw new Error('Unable to perform action');
    }
};

module.exports = {
    performAction
};