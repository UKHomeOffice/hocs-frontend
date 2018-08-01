const formRepository = require('./forms/index');
const listService = require('./list');
const { workflowServiceClient } = require('../libs/request');
const ErrorModel = require('../models/error');

async function getFormSchemaFromWorkflowService({ caseId, stageId }) {
    const response = await workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`);
    const { stageUUID, caseReference } = response.data;
    const { schema, data } = response.data.form;
    return { schema, data, meta: { caseReference, stageUUID } };
}

async function getFormSchema(options) {
    const { user } = options;
    const form = formRepository.getForm(options);
    await hydrateFields(form.schema.fields, { user });
    return { ...form, data: {}, meta: {} };
}

function hydrateFields(fields, options) {
    const promises = fields.map(async field => {
        switch (field.component) {
        case 'radio':
        case 'checkbox':
        case 'dropdown':
            if (field.props && field.props.choices && typeof field.props.choices === 'string') {
                field.props.choices = await listService.getList(field.props.choices, { ...options });
            }
            break;
        case 'add-document':
            if (field.props && field.props.whitelist && typeof field.props.whitelist === 'string') {
                field.props.whitelist = await listService.getList(field.props.whitelist);
            }
            break;
        }
        return field;
    });
    return Promise.all(promises);
}

const getFormForAction = async (req, res, next) => {
    const { workflow, action } = req.params;
    try {
        req.form = await getFormSchema({ context: 'ACTION', workflow, action, user: req.user });
    } catch (err) {
        res.error = new ErrorModel({
            status: 404,
            title: 'Error',
            summary: 'Form not found',
            stackTrace: err.stack
        });
    }
    next();
};

const getFormForCase = async (req, res, next) => {
    const { action } = req.params;
    try {
        req.form = await getFormSchema({ context: 'WORKFLOW', action, user: req.user });
    } catch (err) {
        res.error = new ErrorModel({
            status: 404,
            title: 'Error',
            summary: 'Form not found',
            stackTrace: err.stack
        });
    }
    next();
};

const getFormForStage = async (req, res, next) => {
    const { caseId, stageId } = req.params;
    try {
        req.form = await getFormSchemaFromWorkflowService({ caseId, stageId, user: req.user });
    } catch (err) {
        res.error = new ErrorModel({
            status: 404,
            title: 'Error',
            summary: 'Form not found',
            stackTrace: err.stack
        });
    }
    next();
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};