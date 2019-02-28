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
                return { error: { status: 401 } };
            case 403:
                // handle not allocated
                // TODO: Move to form schema
                /* eslint-disable-next-line no-case-declarations */
                let usersInTeam;
                try {
                    const { data: owningTeam } = await caseworkServiceClient.get(`/case/${caseId}/stage/${stageId}/team`, { headers });
                    usersInTeam = await listService.getList('USERS_IN_TEAM', { teamId: owningTeam, user });
                } catch (error) {
                    usersInTeam = [];
                }
                return {
                    form: {
                        schema: {
                            title: 'Allocate Case',
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
                                        className: 'govuk-body',
                                        choices: usersInTeam
                                    }
                                }
                            ],
                            defaultActionLabel: 'Allocate',
                            secondaryActions: [
                                {
                                    component: 'backlink',
                                    validation: [],
                                    props: {
                                        label: 'Back to dashboard',
                                        action: '/'
                                    }
                                }
                            ]
                        }
                    }
                };
            default:
                return { error: { status: 500 } };
        }
    }
    const { stageUUID, caseReference, allocationNote } = response.data;
    const mockAllocationNote = allocationNote || null;
    const { schema, data } = response.data.form;
    await hydrateFields(schema.fields, { ...options, user });
    return { form: { schema, data, meta: { caseReference, stageUUID, allocationNote: mockAllocationNote } } };
}

async function getFormSchemaForCase(options) {
    const form = await formRepository.getFormForCase(options);
    await hydrateFields(form.schema.fields, options);
    return form;
}

async function getFormSchema(options) {
    const form = await formRepository.getForm(options);
    await hydrateFields(form.schema.fields, options);
    return form;
}

function hydrateFields(fields, options) {
    logger.debug({ event: events.HYDRATE_FORM_FIELDS });
    const promises = fields.map(async field => {
        if (field.props && field.props.choices) {
            if (typeof field.props.choices === 'string') {
                if (field.component === 'add-document') {
                    try {
                        field.props.whitelist = await listService.getList(field.props.whitelist);
                    } catch (error) {
                        logger.error(error);
                        field.props.whitelist = [];
                    }
                } else {
                    try {
                        field.props.choices = await listService.getList(field.props.choices, { ...options });
                    } catch (error) {
                        logger.error(error);
                        field.props.choices = [];
                    }
                }
            }
        }
        return field;
    });
    return Promise.all(promises);
}

const getForm = (form) => {
    return async (req, res, next) => {
        logger.info({ event: 'GET_FORM', user: req.user.username });
        try {
            const { schema, data, meta } = await form({ submissionUrl: req.url }).build();
            await hydrateFields(schema.fields, { user: req.user });
            req.form = { schema, data, meta };
            next();
        } catch (error) {
            next('Something went wrong');
        }
    };
};

const getFormForAction = async (req, res, next) => {
    const { workflow, context, action } = req.params;
    logger.info({ event: events.ACTION_FORM, workflow, context, action, user: req.user.username });
    try {
        const form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error({ event: events.ACTION_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForCase = async (req, res, next) => {
    try {
        logger.info({ event: events.CASE_FORM, ...req.params, user: req.user.username });
        const form = await getFormSchemaForCase({ ...req.params, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error({ event: events.CASE_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForStage = async (req, res, next) => {
    const { user } = req;
    try {
        logger.info({ event: events.WORKFLOW_FORM, ...req.params, user: req.user.username });
        const { form, error } = await getFormSchemaFromWorkflowService(req.params, user);
        if (error) {
            return next(new FormServiceError('Failed to fetch form', error.status));
        } else {
            req.form = form;
            next();
        }
    } catch (error) {
        logger.error({ event: events.WORKFLOW_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

module.exports = {
    getForm,
    getFormForAction,
    getFormForCase,
    getFormForStage
};