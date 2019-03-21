const formRepository = require('./forms/index');
const { fetchList } = require('../list/service');
const { workflowServiceClient, caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const events = require('../models/events');
const { FormServiceError } = require('../models/error');
const User = require('../models/user');

async function getFormSchemaFromWorkflowService(requestId, options, user) {
    const { caseId, stageId } = options;
    const headers = User.createHeaders(user);
    let response;
    try {
        response = await workflowServiceClient.get(`/case/${caseId}/stage/${stageId}`, { headers });
    } catch (error) {
        switch (error.response.status) {
            case 401:
                // handle as error
                return { error: { status: 401, message: 'You are not authorised to work on this case' } };
            case 403:
                // handle not allocated
                // TODO: Move to form schema
                /* eslint-disable-next-line no-case-declarations */
                let usersInTeam;
                try {
                    const { data: owningTeam } = await caseworkServiceClient.get(`/case/${caseId}/stage/${stageId}/team`, { headers });
                    usersInTeam = await fetchList(requestId)('USERS_IN_TEAM', User.createHeaders(user), { teamId: owningTeam });
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
    return { form: { schema, data, meta: { caseReference, stageUUID, allocationNote: mockAllocationNote } } };
}

async function getFormSchemaForCase(options) {
    const form = await formRepository.getFormForCase(options);
    return form;
}

async function getFormSchema(options) {
    const form = await formRepository.getForm(options);
    return form;
}

const hydrateFields = async (req, res, next) => {
    if (req.form) {
        const { schema } = req.form;
        logger.debug({ requestId: req.requestId, event_id: events.HYDRATE_FORM_FIELDS, count: schema.fields.length });
        const requests = schema.fields.map(async field => {
            if (field.props) {
                const { choices, items } = field.props;
                if (choices && typeof choices === 'string') {
                    field.props.choices = await req.fetchList(
                        choices,
                        req.params
                    );
                } else if (items && typeof items === 'string') {
                    field.props.items = await req.fetchList(
                        items,
                        req.params
                    );
                }
            }
            return field;
        });
        await Promise.all(requests);
        next();
    } else {
        next();
    }
};

const getForm = (form, options) => {
    return async (req, res, next) => {
        logger.info({ event_id: 'GET_FORM', user: req.user.username });
        try {
            const { schema, data, meta } = await form({ ...options }).build();
            req.form = { schema, data, meta };
            next();
        } catch (error) {
            next('Something went wrong');
        }
    };
};

const getFormForAction = async (req, res, next) => {
    const { workflow, context, action } = req.params;
    logger.info({ event_id: events.ACTION_FORM, workflow, context, action, user: req.user.username });
    try {
        const form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error({ event_id: events.ACTION_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForCase = async (req, res, next) => {
    try {
        logger.info({ event_id: events.CASE_FORM, ...req.params, user: req.user.username });
        const form = await getFormSchemaForCase({ ...req.params, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error({ event_id: events.CASE_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForStage = async (req, res, next) => {
    const { user } = req;
    try {
        logger.info({ event_id: events.WORKFLOW_FORM, ...req.params, user: req.user.username });
        const { form, error } = await getFormSchemaFromWorkflowService(req.requestId, req.params, user);
        if (error) {
            return next(new FormServiceError('Failed to fetch form', error.status));
        } else {
            req.form = form;
            next();
        }
    } catch (error) {
        logger.error({ event_id: events.WORKFLOW_FORM_FAILURE, message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

module.exports = {
    getForm,
    getFormForAction,
    getFormForCase,
    getFormForStage,
    hydrateFields
};