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
                return { error: new PermissionError('You are not authorised to work on this case') };
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
                    const { readOnlyCaseViewAdapter } = await listService.getInstance(requestId, user).fetch('S_SYSTEM_CONFIGURATION');
                    caseView = await listService.getInstance(requestId, user).fetch(readOnlyCaseViewAdapter, { caseId });
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
                    .withSubmissionUrl(`/case/${caseId}/stage/${stageId}/allocate/team`)
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

async function hydrateField(field, req) {
    if (field.props) {
        const { choices, items, sections, conditionChoices } = field.props;

        if (conditionChoices) {
            for (var i = 0; i < conditionChoices.length; i++) {
                if (typeof conditionChoices[i].choices === 'string') {
                    field.props.conditionChoices[i].choices = await req.listService.fetch(
                        conditionChoices[i].choices,
                        req.params
                    );
                } else {
                    field.props.conditionChoices[i].choices = conditionChoices[i].choices;
                }
                const conditionPropertyValue = req.form.data[conditionChoices[i].conditionPropertyName];
                if (conditionChoices[i].conditionPropertyValue === conditionPropertyValue) {
                    field.props.choices = field.props.conditionChoices[i].choices;
                }
            }
        } else if (choices && typeof choices === 'string') {
            field.props.choices = await req.listService.fetch(
                choices,
                req.params
            );
        } else if (items && typeof items === 'string') {
            field.props.items = await req.listService.fetch(
                items,
                req.params
            );
        } else if (sections) {
            const sectionRequests = sections.map(async section => {
                const fieldRequests = section.items.map(async item => await hydrateField(item, req));
                await Promise.all(fieldRequests);
            });
            await Promise.all(sectionRequests);
        }
    }
    return field;
}

const hydrateFields = async (req, res, next) => {

    const logger = getLogger(req.requestId);

    if (req.form) {
        const { schema } = req.form;
        logger.debug('HYDRATE_FORM_FIELDS', { count: schema.fields.length });
        const requests = await schema.fields.map(async (field) => await hydrateField(field, req));

        try {
            await Promise.all(requests);
        } catch (error) {
            if (error instanceof PermissionError) {
                return next(error);
            }
            if (error.response !== undefined && error.response.status === 401) {
                return next(new PermissionError('You are not authorised to work on this case'));
            }
            return next(new FormServiceError('Failed to fetch form'));
        }
    }
    next();
};

const getForm = (form, options) => {
    return async (req, res, next) => {

        const logger = getLogger(req.requestId);

        logger.info('GET_FORM');
        try {
            const formBuilder = await form({ ...options, user: req.user, listService: req.listService });
            const { schema, data, meta } = formBuilder.build();
            req.form = { schema, data, meta };
            next();
        } catch (error) {
            logger.error(error);
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
        return next();
    } catch (error) {
        logger.error('ACTION_FORM_FAILURE', { message: error.message, stack: error.stack });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForCase = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_FORM', { ...req.params });

    try {
        const form = await getFormSchemaForCase({ ...req.params, user: req.user, requestId: req.requestId });
        req.form = form;
        next();
    } catch (error) {
        logger.error('CASE_FORM_FAILURE', { message: error.message, stack: error.stack });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
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
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
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
