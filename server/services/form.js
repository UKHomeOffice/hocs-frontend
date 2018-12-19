const formRepository = require('./forms/index');
const listService = require('./list');
const { workflowServiceClient, caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const events = require('../models/events');
const { FormServiceError } = require('../models/error');
const User = require('../models/user');

async function getFormSchemaFromWorkflowService(options, user) {
    const { caseId, stageId } = options;
    const headers = User.createHeaders(user);
    let response;
    try {
        response = await workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`, { headers });
    } catch (error) {
        switch (error.response.status) {
            case 401:
                // handle as error
                throw new Error('Permission denied');
            case 403:
                // handle not allocated
                /* eslint-disable-next-line no-case-declarations */
                let usersInTeam;
                try {
                    const { data: owningTeam } = await caseworkServiceClient.get(`/case/${caseId}/stage/${stageId}/team`, { headers });
                    usersInTeam = await listService.getList('USERS_IN_TEAM', { teamId: owningTeam, user });
                } catch (error) {
                    usersInTeam = [];
                }
                return {
                    schema: {
                        title: 'Allocate case',
                        action: `/case/${caseId}/stage/${stageId}/allocate/team`,
                        fields: [
                            {
                                component: 'link', props: {
                                    name: 'allocate-to-me',
                                    label: 'Allocate to me',
                                    className: 'govuk-body margin-bottom--small',
                                    target: `/case/${caseId}/stage/${stageId}/allocate`
                                }
                            },
                            {
                                component: 'dropdown', props: {
                                    name: 'user-id',
                                    label: 'Allocate to a team member',
                                    choices: usersInTeam
                                }
                            }
                        ],
                        defaultActionLabel: 'Allocate'
                    }
                };
            default:
                throw new Error('System error');
        }
    }
    const { stageUUID, caseReference, allocationNote } = response.data;
    const mockAllocationNote = allocationNote || {
        type: 'Allocation Note',
        message: 'You just sort of have to make almighty decisions. Just leave that space open. Let\'s start with an almighty sky here.'
    };
    const { schema, data } = response.data.form;
    await hydrateFields(schema.fields, { ...options, user });
    return { schema, data, meta: { caseReference, stageUUID, allocationNote: mockAllocationNote } };
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
    const { user } = req;
    try {
        logger.info({ event: events.WORKFLOW_FORM, ...req.params, user: req.user.username });
        req.form = await getFormSchemaFromWorkflowService(req.params, user);
    } catch (e) {
        logger.error({ event: events.WORKFLOW_FORM_FAILURE, message: e.message, stack: e.stack });
        return next(new FormServiceError(e.message));
    }
    next();
};

module.exports = {
    getFormForAction,
    getFormForCase,
    getFormForStage
};