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

const getFormForAction = (req, res, callback) => {
    const {action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: getForm('action', {action, user: req.user})
    };
    res.noScript = noScript;
    callback();
};

const getFormForCase = (req, res, callback) => {
    const {type, action} = req.params;
    const {noScript = false} = req.query;
    req.form = {
        data: {},
        schema: getForm('workflow', {type, action})
    };
    res.noScript = noScript;
    callback();
};

module.exports = {
    getForm,
    getFormForAction,
    getFormForCase
};