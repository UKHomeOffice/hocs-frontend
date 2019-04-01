const formRepository = require('./forms/index');
const listService = require('./list/service');
const { workflowService, caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const { FormServiceError } = require('../models/error');
const User = require('../models/user');

async function getFormSchemaFromWorkflowService(requestId, options, user) {
    const { caseId, stageId } = options;
    const headers = User.createHeaders(user);
    let response;
    try {
        response = await workflowService.get(`/case/${caseId}/stage/${stageId}`, { headers });
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
                const { data: owningTeam } = await caseworkService.get(`/case/${caseId}/stage/${stageId}/team`, { headers });
                usersInTeam = await listService.getInstance(requestId).fetch('USERS_IN_TEAM', { teamId: owningTeam });
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

    const logger = getLogger(req.requestId);

    if (req.form) {
        const { schema } = req.form;
        logger.debug('HYDRATE_FORM_FIELDS', { count: schema.fields.length });
        const requests = schema.fields.map(async field => {
            if (field.props) {
                const { choices, items } = field.props;
                if (choices && typeof choices === 'string') {
                    field.props.choices = await req.listService.fetch(
                        choices,
                        req.params
                    );
                } else if (items && typeof items === 'string') {
                    field.props.items = await req.listService.fetch(
                        items,
                        req.params
                    );
                }
            }
            return field;
        });
        try {
            await Promise.all(requests);
        } catch (error) {
            return next(new Error('Failed to populate form fields'));
        }
        next();
    } else {
        next();
    }
};

const getForm = (form, options) => {
    return async (req, res, next) => {

        const logger = getLogger(req.requestId);

        logger.info('GET_FORM');
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

    const logger = getLogger(req.requestId);
    logger.info('GET_FORM', { ...req.params });

    try {
        const { workflow, context, action } = req.params;
        const form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error('ACTION_FORM_FAILURE', { message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForCase = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_FORM', { ...req.params });

    try {
        const form = await getFormSchemaForCase({ ...req.params, user: req.user });
        req.form = form;
        next();
    } catch (error) {
        logger.error('CASE_FORM_FAILURE', { message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForStage = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_FORM', { ...req.params });

    const { user } = req;
    try {
        const { form, error } = await getFormSchemaFromWorkflowService(req.requestId, req.params, user);
        if (error) {
            return next(new FormServiceError('Failed to fetch form', error.status));
        } else {
            req.form = form;
            next();
        }
    } catch (error) {
        logger.error('WORKFLOW_FORM_FAILURE', { message: error.message, stack: error.stack });
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