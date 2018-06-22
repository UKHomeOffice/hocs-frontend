const formRepository = require('../forms/index');
const listService = require('./list');

const actions = {
    action: ({action, user}) => {
        switch(action) {
            case 'create':
                const form = formRepository.getForm('caseCreate');
                form.fields = form.fields.map(field => {
                    const choices = field.props.choices;
                    if (choices && typeof choices === 'string') {
                        field.props.choices = listService.getList(choices, {user});
                    }
                    return field;
                });
                return form;
        }
    },
    workflow: ({type, action}) => {
        // TODO: call workflow service for form
        return formRepository.getForm('testForm');
    }
};

const getForm = (action, options) => {
    try {
        return actions[action.toLowerCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get form for ${action}: ${e}`);
    }
};

module.exports = {
    getForm
};