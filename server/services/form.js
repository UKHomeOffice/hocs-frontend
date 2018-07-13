const formRepository = require('../forms/index');
const listService = require('./list');
const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

const actions = {
    action: ({ action, user }) => {
        switch (action) {
        case 'create':
            return getCreateForm(user);
        case 'bulk':
            return getBulkCreateForm(user);
        }
    },
    workflow: ({ action, caseId }) => {
        // TODO: call workflow service for form
        let form;
        switch (action) {
        case 'document':
            form = formRepository.getForm('addDocument');
            break;
        case 'bulkDocument':
            form = formRepository.getForm('bulkAddDocument');
            break;
        }
        const { form: { schema, data } } = form;
        schema.fields = schema.fields.map(field => {
            if (field.component === 'addDocument' || field.component === 'bulkAddDocument') {
                const whitelist = field.props.whitelist;
                if (whitelist && typeof whitelist === 'string') {
                    field.props.whitelist = listService.getList(whitelist);
                }
            }
            return field;
        });
        return { schema, data, meta: { caseId } };
    },
    stage: ({ caseId, stageId }, callback) => {
        workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`)
            .then((response) => {
                if (response && response.data && response.data && response.data.form) {
                    const stageUUID = response.data.stageUUID;
                    const caseRef = response.data.caseReference;
                    const { schema, data } = response.data.form;
                    return callback({ schema, data, meta: { caseRef, stageUUID } });
                }
                callback();
            })
            .catch((err) => {
                logger.error(`${err.message}`);
                callback();
            });
    }
};

const getForm = (action, options, callback) => {
    try {
        return actions[action.toLowerCase()].call(this, options, callback);
    } catch (e) {
        logger.error(`Unable to get form for ${action}`);
        throw e;
    }
};

const getFormForAction = (req, res, callback) => {
    const { action } = req.params;
    const { noScript = false } = req.query;
    req.form = getForm('action', { action, user: req.user });
    res.noScript = noScript;
    callback();
};

const getFormForCase = (req, res, callback) => {
    const { type, action } = req.params;
    const { noScript = false } = req.query;
    req.form = getForm('workflow', { type, action });
    res.noScript = noScript;
    callback();
};

const getFormForStage = (req, res, callback) => {
    const { caseId, stageId } = req.params;
    const { noScript = false } = req.query;
    getForm('stage', { caseId, stageId }, form => {
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

function getCreateForm(user) {
    const { form: { schema, data } } = formRepository.getForm('caseCreate');
    schema.fields = populateFields(schema.fields, user);
    return { schema, data };
}

function getBulkCreateForm(user) {
    const { form: { schema, data } } = formRepository.getForm('bulkCreate');
    schema.fields = populateFields(schema.fields, user);
    return { schema, data };
}

function populateFields(fields, user) {
    return fields.map(field => {
        const choices = field.props.choices;
        if (choices && typeof choices === 'string') {
            field.props.choices = listService.getList(choices, { user });
        }
        return field;
    });
}