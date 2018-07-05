const formRepository = require('../forms/index');
const listService = require('./list');
const {WORKFLOW_SERVICE} = require('../config').forContext('server');
const logger = require('../libs/logger');
const axios = require('axios');

const actions = {
    action: ({action, user}) => {
        switch (action) {
            case 'create':
                const {form: {schema, data}} = formRepository.getForm('caseCreate');
               schema.fields = schema.fields.map(field => {
                    const choices = field.props.choices;
                    if (choices && typeof choices === 'string') {
                        field.props.choices = listService.getList(choices, {user});
                    }
                    return field;
                });
                return {schema, data};
        }
    },
    workflow: ({caseId, action}) => {
        // TODO: call workflow service for form
        const {form: {schema, data}} = formRepository.getForm('addDocument');
        schema.fields = schema.fields.map(field => {
            if (field.component === 'addDocument') {
                const whitelist = field.props.whitelist;
                if (whitelist && typeof whitelist === 'string') {
                    field.props.whitelist = listService.getList(whitelist);
                }
            }
            return field;
        });
        return {schema, data, meta: {caseId}};
    },
    stage: ({caseId, stageId}, callback) => {
        axios.get(`${WORKFLOW_SERVICE}/case/${caseId}/stage/${stageId}`)
            .then((response) => {
                if(response && response.data && response.data && response.data.form) {
                    const stageUUID = response.data.stageUUID;
                    const caseRef = response.data.caseReference;
                    const {schema, data} = response.data.form;
                    return callback({schema, data, meta: {caseRef, stageUUID}});
                }
                callback();
            })
            .catch((err) => {
            });
        //return formRepository.getForm('testForm');
    }
};

const getForm = (action, options, callback) => {
    try {
        return actions[action.toLowerCase()].call(this, options, callback);
    } catch (e) {
        throw new Error(`Unable to get form for ${action}: ${e}`);
    }
};

const getFormForAction = (req, res, callback) => {
    const {action} = req.params;
    const {noScript = false} = req.query;
    req.form = getForm('action', {action, user: req.user});
    res.noScript = noScript;
    callback();
};

const getFormForCase = (req, res, callback) => {
    const {type, action} = req.params;
    const {noScript = false} = req.query;
    req.form = getForm('workflow', {type, action});
    res.noScript = noScript;
    callback();
};

const getFormForStage = (req, res, callback) => {
    const {caseId, stageId} = req.params;
    const {noScript = false} = req.query;
    getForm('stage', {caseId, stageId}, form => {
        req.form = form;
        res.noScript = noScript;
        callback();
    });

};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};