const formRepository = require('./forms/index');
const listService = require('./list');
const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

async function getFormSchemaFromWorkflowService({ caseId, stageId }) {
    const response = await workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`);
    try {
        const { stageUUID, caseReference } = response.data;
        const { schema, data } = response.data.form;
        return { schema, data, meta: { caseReference, stageUUID } };
    } catch (err) {
        logger.error(`${err.message}`);
    }
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

const getFormForAction = async (req, res, callback) => {
    const { workflow, action } = req.params;
    try {
        req.form = await getFormSchema({ context: 'ACTION', workflow, action, user: req.user });
    } catch (err) {
        req.error = { errorCode: 404, title: 'Error', error: 'Form not found' };
    }
    callback();
};

const getFormForCase = (req, res, callback) => {
    const { action } = req.params;
    req.form = getFormSchema({ context: 'WORKFLOW', action, user: req.user });
    callback();
};

const getFormForStage = async (req, res, callback) => {
    const { caseId, stageId } = req.params;
    try {
        req.form = await getFormSchemaFromWorkflowService({ caseId, stageId, user: req.user });
    } catch (err) {
        req.error = { errorCode: 404, title: 'Error', error: 'Form not found', stack: err.stack };
    }
    callback();
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};