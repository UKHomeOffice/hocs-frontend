const formRepository = require('../forms/index');
const listService = require('./list');
const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

const actions = {
    action: ({ action, user }) => {
        switch (action) {
        case 'create':
            return getFormSchema('caseCreate', { user });
        case 'bulk':
            return getFormSchema('bulkCreate', { user });
        case 'document':
            return getFormSchema('addDocument');
        case 'bulkDocument':
            return getFormSchema('bulkAddDocument');
        }
    },
    /* eslint-disable-next-line no-unused-vars */
    workflow: ({ action }) => {
        // TODO: populate meta object
        switch (action) {
        case 'document':
            return getFormSchema('addDocument');
        case 'bulkDocument':
            return getFormSchema('bulkAddDocument');
        }
    },
    stage: ({ caseId, stageId }, callback) => {
        workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`)
            .then((response) => {
                if (response && response.data && response.data.form) {
                    const { stageUUID, caseReference } = response.data;
                    const { schema, data } = response.data.form;
                    return callback({ schema, data, meta: { caseReference, stageUUID } });
                }
                callback();
            })
            .catch((err) => {
                logger.error(`${err.message}`);
                callback();
            });
    }
};

function getForm (action, options, callback) {
    try {
        return actions[action.toLowerCase()].call(this, options, callback);
    } catch (e) {
        logger.error(`Unable to get form for ${action}`);
        throw e;
    }
}

function getFormSchema(form, options) {
    const { form: { schema, data } } = formRepository.getForm(form);
    preProcessFields(schema.fields, options);
    return { schema, data, meta: {} };
}

function preProcessFields(fields, options) {
    return fields.map(field => {
        switch (field.component) {
        case 'radio':
        case 'checkbox':
        case 'dropdown':
            if (field.props && field.props.choices && typeof field.props.choices === 'string') {
                field.props.choices = listService.getList(field.props.choices, { user: options.user });
            }
            break;
        case 'addDocument':
        case 'bulkAddDocument':
            if (field.props && field.props.whitelist && typeof field.props.whitelist === 'string') {
                field.props.whitelist = listService.getList(field.props.whitelist);
            }
            break;
        }
        return field;
    });
}

const getFormForAction = (req, res, callback) => {
    const { action } = req.params;
    req.form = getForm('action', { action, user: req.user });
    callback();
};

const getFormForCase = (req, res, callback) => {
    const { action } = req.params;
    req.form = getForm('workflow', { action });
    callback();
};

const getFormForStage = (req, res, callback) => {
    const { caseId, stageId } = req.params;
    getForm('stage', { caseId, stageId }, form => {
        req.form = form;
        callback();
    });
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};