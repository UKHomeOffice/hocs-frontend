const formRepository = require('./forms/index');
const listService = require('./list');
const { workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const events = require('../models/events');
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
    logger.debug({ event: events.HYDRATE_FORM_FIELDS });
    const promises = fields.map(async field => {
        if (field.props && field.props.choices) {
            if (typeof field.props.choices === 'string') {
                if (field.component === 'add-document') {
                    try {
                        field.props.whitelist = await listService.getList(field.props.whitelist);
                    } catch (e) {
                        logger.error(e);
                        field.props.whitelist = [];
                    }
                } else {
                    try {
                        field.props.choices = await listService.getList(field.props.choices, { ...options });
                    } catch (e) {
                        logger.error(e);
                        field.props.choices = [];
                    }
                }
            }
        }
        return field;
    });
    return Promise.all(promises);
}

const getFormForAction = async (req, res, next) => {
    const { workflow, context, action } = req.params;
    logger.info({ event: events.ACTION_FORM, workflow, context, action, user: req.user.username });
    try {
        req.form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user });
    } catch (e) {
        logger.error({ event: events.ACTION_FORM_FAILURE, message: e.message, stack: e.stack });
        return next(new FormServiceError());
    }
    next();
};

const getFormForCase = async (req, res, next) => {
    try {
        logger.info({ event: events.CASE_FORM, ...req.params, user: req.user.username });
        req.form = await getFormSchemaForCase({ ...req.params, user: req.user });
    } catch (e) {
        logger.error({ event: events.CASE_FORM_FAILURE, message: e.message, stack: e.stack });
        return next(new FormServiceError());
    }
    next();
};

const getFormForStage = async (req, res, next) => {
    try {
        logger.info({ event: events.WORKFLOW_FORM, ...req.params, user: req.user.username });
        req.form = await getFormSchemaFromWorkflowService(req.params);
    } catch (e) {
        logger.error({ event: events.WORKFLOW_FORM_FAILURE, message: e.message, stack: e.stack });
        return next(new FormServiceError());
    }
    next();
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};