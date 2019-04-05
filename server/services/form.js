const formRepository = require('./forms/index');
const listService = require('./list/service');
const { workflowService, caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const { FormServiceError, PermissionError } = require('../models/error');
const User = require('../models/user');
const FormBuilder = require('./forms/form-builder');
const { Component } = require('./forms/component-builder');

async function getFormSchemaFromWorkflowService(requestId, options, user) {
    const { caseId, stageId } = options;
    const headers = User.createHeaders(user);
    let response;
    try {
        response = await workflowService.get(`/case/${caseId}/stage/${stageId}`, { headers });
    } catch (error) {
        switch (error.response.status) {
        case 401:
            // handle no permission to allocate
            try {
                const response = await listService.getInstance(requestId, user).fetch('CASE_VIEW', { caseId });
                return { form: response };
            } catch (error) {
                return { error: new PermissionError('You are not authorised to work on this case') };
            }
        case 403:
            // handle not allocated
            /* eslint-disable-next-line no-case-declarations */
            let usersInTeam;
            /* eslint-disable-next-line no-case-declarations */
            let caseView;
            try {
                const { data: owningTeam } = await caseworkService.get(`/case/${caseId}/stage/${stageId}/team`, { headers });
                usersInTeam = await listService.getInstance(requestId, user).fetch('USERS_IN_TEAM', { teamId: owningTeam });
            } catch (error) {
                usersInTeam = [];
            }
            try {
                caseView = await listService.getInstance(requestId, user).fetch('CASE_VIEW', { caseId });
            } catch (error) {
                caseView = null;
            }
            /* eslint-disable-next-line no-case-declarations */
            const response = FormBuilder(caseView)
                .withField(Component('heading', 'allocate-header')
                    .withProp('label', 'Allocate')
                    .build())
                .withField(Component('link', 'allocate-to-me')
                    .withProp('label', 'Allocate to me')
                    .withProp('className', 'govuk-body margin-bottom--small')
                    .withProp('target', `/case/${caseId}/stage/${stageId}/allocate`)
                    .build())
                .withField(Component('dropdown', 'user-id')
                    .withProp('label', 'Allocate to a team member')
                    .withProp('className', 'govuk-body')
                    .withProp('choices', usersInTeam)
                    .build())
                .withPrimaryAction('Allocate')
                .withSecondaryAction(
                    Component('backlink')
                        .withProp('label', 'Cancel')
                        .build()
                )
                .build();
            return { form: response };
        default:
            return { error: new Error(`Failed to retrieve form: ${error.response.status}`) };
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
    }
    next();
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
            return next(error);
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