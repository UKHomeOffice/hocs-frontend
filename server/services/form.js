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
    const { action } = options;
    const form = formRepository.getForm(options);
    let data = {};
    switch (action) {
    case 'DOCUMENT':
        data = { 'DateReceived': new Date().toISOString().substr(0, 10) };
        break;
    }
    await hydrateFields(form.schema.fields, options);
    return { ...form, data: data, meta: {} };
}

function hydrateFields(fields, options) {
    const promises = fields.map(async field => {
        switch (field.component) {
        case 'radio':
        case 'checkbox':
        case 'dropdown':
        case 'entity-list':
        case 'entity-manager':
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
        req.form = await getFormSchemaForCase(req.params);
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