const formRepository = require('./forms/index');
const listService = require('./list');
const { workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { FormServiceError } = require('../models/error');

async function getFormSchemaFromWorkflowService(options) {
    const { caseId, stageId } = options;
    const response = await workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`);
    const { stageUUID, caseReference } = response.data;
    const { schema, data } = response.data.form;
    await hydrateFields(schema.fields, options);
    return { schema, data, meta: { caseReference, stageUUID } };
}

async function getFormSchemaForCase(options) {
    const form = await formRepository.getFormForCase(options);
    await hydrateFields(form.schema.fields, options);
    return { ...form };
}

async function getFormSchema(options) {
    const form = await formRepository.getForm(options);
    await hydrateFields(form.schema.fields, options);
    return { ...form, meta: {} };
}

function hydrateFields(fields, options) {
    const promises = fields.map(async field => {
        if (field.props && field.props.choices) {
            if (typeof field.props.choices === 'string') {
                if(field.component === 'add-document') {
                    field.props.whitelist = await listService.getList(field.props.whitelist);
                } else {
                    field.props.choices = await listService.getList(field.props.choices, { ...options });
                }
            }
        }
        return field;
    });
    return Promise.all(promises);
}

const getFormForAction = async (req, res, next) => {
    const { workflow, context, action } = req.params;
    try {
        req.form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user });
    } catch (e) {
        logger.error(e);
        return next(new FormServiceError());
    }
    next();
};

const getFormForCase = async (req, res, next) => {
    try {
        req.form = await getFormSchemaForCase({ ...req.params, user: req.user });
    } catch (e) {
        logger.error(e);
        return next(new FormServiceError());
    }
    next();
};

const getFormForStage = async (req, res, next) => {
    try {
        req.form = await getFormSchemaFromWorkflowService(req.params);
    } catch (e) {
        logger.error(e);
        return next(new FormServiceError());
    }
    next();
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};