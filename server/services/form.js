const formRepository = require('./forms/index');
const listService = require('./list');
const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

function getFormSchemaFromWorkflowService({ caseId, stageId }, callback) {
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

function getFormSchema(options) {
    const { user } = options;
    const form = formRepository.getForm(options);
    hydrateFields(form.schema.fields, { user });
    return { ...form, data: {}, meta: {} };
}

function hydrateFields(fields, options) {
    return fields.map(field => {
        switch (field.component) {
        case 'radio':
        case 'checkbox':
        case 'dropdown':
            if (field.props && field.props.choices && typeof field.props.choices === 'string') {
                field.props.choices = listService.getList(field.props.choices, { ...options });
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
    const { workflow, action } = req.params;
    req.form = getFormSchema({ context: 'ACTION', workflow, action, user: req.user });
    callback();
};

const getFormForCase = (req, res, callback) => {
    const { action } = req.params;
    req.form = getFormSchema({ context: 'WORKFLOW', action, user: req.user });
    callback();
};

const getFormForStage = (req, res, callback) => {
    const { caseId, stageId } = req.params;
    getFormSchemaFromWorkflowService({ caseId, stageId, user: req.user }, form => {
        req.form = form;
        callback();
    });
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};