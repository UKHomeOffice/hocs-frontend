const formRepository = require('./forms/index');
const listService = require('./list/service');
const { workflowService, caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const { FormServiceError, AuthenticationError } = require('../models/error');
const User = require('../models/user');
const FormBuilder = require('./forms/form-builder');
const { Component } = require('./forms/component-builder');
const { getSomuItem } = require('../middleware/somu');

async function returnUnallocatedCaseViewForm(requestId, user, caseId) {
    return await listService.getInstance(requestId, user)
        .fetch('CASE_VIEW_UNALLOCATED', { caseId });
}

async function getFormSchemaFromWorkflowService(requestId, options, user) {
    const { caseId, stageId } = options;
    const headers = { ...User.createHeaders(user), 'X-Correlation-Id': requestId };
    let response;
    try {
        response = await workflowService.get(`/case/${caseId}/stage/${stageId}`, { headers });
    } catch (error) {
        switch (error.response.status) {
            case 401:
                // handle no permission to allocate
                try {
                    return { form: await returnUnallocatedCaseViewForm(requestId, user, caseId) };
                } catch (error) {
                    return { error: new AuthenticationError('You are not authorised to work on this case') };
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
                    caseView = await returnUnallocatedCaseViewForm(requestId, user, caseId);
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
                            .withProp('action', '/')
                            .build()
                    )
                    .build();
                return { form: response };
            default:
                return { error: new Error(`Failed to retrieve form: ${error.response.status}`) };
        }
    }
    if (response.data.form === null) {
        const response = await returnUnallocatedCaseViewForm(requestId, user, caseId);
        return { form: response };
    }
    const { stageUUID, caseReference, allocationNote } = response.data;
    const mockAllocationNote = allocationNote || null;
    const { schema, data } = response.data.form;
    return { form: { schema, data, meta: { caseReference, stageUUID, allocationNote: mockAllocationNote, activeForm: true } } };
}

async function getGlobalFormSchemaFromWorkflowService(options, user, requestId) {
    const { caseId, formId } = options;
    const headers = { ...User.createHeaders(user), 'X-Correlation-Id': requestId };

    let response;
    try {
        response = await workflowService.get(`/case/${caseId}/form/${formId}`, { headers });
    } catch (error) {
        return { error: new Error(`Failed to retrieve form: ${error.response.status}`) };
    }

    const { stageUUID, caseReference, allocationNote } = response.data;
    const { schema, data } = response.data.form;
    return { form: { schema, data, meta: { caseReference, stageUUID, allocationNote } } };
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
        const { choices, items, sections, conditionChoices, somuType, child } = field.props;

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
                { ...req.params, ...req.form.data }
            );

            if (Object.prototype.hasOwnProperty.call(req.form, 'meta') &&
                Object.prototype.hasOwnProperty.call(req.form.meta, 'activeForm') &&
                req.form.meta.activeForm) {
                field.props.choices = field.props.choices.filter(c => c.active !== false);
            }
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
        } else if (somuType) {
            const { caseType, type } = somuType;

            const somuTypeItem = await req.listService.getFromStaticList(
                'SOMU_TYPES',
                [caseType, type]
            );
            field.props.somuType = somuTypeItem;

            if (choices && typeof choices === 'object') {
                const choiceObj = {};

                for (const [name, choice] of Object.entries(choices)) {
                    if (choice) {
                        Object.assign(choiceObj, { [name]: await req.listService.fetch(choice, req.params) });
                    }
                }

                field.props.choices = choiceObj;
            }

            field.props.somuItems = await req.listService.fetch('CASE_SOMU_ITEM', {
                ...req.params,
                somuTypeId: somuTypeItem.uuid
            });
        } else if (child && child.props && child.props.choices && typeof child.props.choices === 'string') {
            field.props.child.props.choices = await req.listService.fetch(child.props.choices, req.params);
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
            if (error instanceof AuthenticationError) {
                return next(error);
            }
            if (error.response !== undefined && error.response.status === 401) {
                return next(new AuthenticationError('You are not authorised to work on this case'));
            }
            return next(new FormServiceError('Failed to fetch form'));
        }
    }
    return next();
};

const getForm = (form, options) => {
    return async (req, res, next) => {

        const logger = getLogger(req.requestId);

        logger.info('GET_FORM');
        try {
            const formBuilder = await form({ ...options, user: req.user, requestId: req.requestId, listService: req.listService });
            const { schema, data, meta } = formBuilder.build();
            req.form = { schema, data, meta };
            return next();
        } catch (error) {
            logger.error(error);
            return next('Something went wrong');
        }
    };
};

async function getSomuType(req, res, next) {
    const { somuCaseType, somuType } = req.params;

    const somuTypeData = await req.listService.getFromStaticList(
        'SOMU_TYPES',
        [somuCaseType, somuType]
    );

    req.somuType = somuTypeData;
    return next();
}

async function getSomuItemData(req, res, next) {
    const { requestId, user, params: { caseId, somuItemUuid, somuTypeUuid } }  = req;

    if (somuItemUuid) {
        req.somuItemData = await getSomuItem({ caseId, somuTypeUuid, somuItemUuid, user, requestId });
    }

    return next();
}

async function getList(req, res, next) {
    const { listName } = req.params;

    const listContent = await req.listService.fetch(listName);

    req.listContent = listContent;
    return next();
}

async function getSomuItemsByType(req, res, next) {
    const { somuTypeUuid } = req.params;

    const somuItems = await req.listService.fetch('CASE_SOMU_ITEM', { ...req.params, somuTypeId: somuTypeUuid });
    req.somuItems = somuItems;

    return next();
}

const getFormForAction = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_ACTION_FORM', { ...req.params });

    try {
        const { workflow, context, action } = req.params;
        const { from } = req.query ? req.query : { from: null };
        const form = await getFormSchema({ context: 'ACTION', workflow, entity: context, action, user: req.user, data : { from } });
        req.form = form;
        return next();
    } catch (error) {
        logger.error('ACTION_FORM_FAILURE', { message: error.message, stack: error.stack });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new AuthenticationError('You are not authorised to work on this case'));
        }
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForCase = async (req, res, next) => {
    const logger = getLogger(req.requestId);
    logger.info('GET_CASE_FORM', { ...req.params });
    let caseActionData;
    if (res.locals && res.locals.caseActionData) {
        caseActionData = res.locals.caseActionData;
    }

    try {
        const form = await getFormSchemaForCase({ ...req.params, user: req.user, requestId: req.requestId, caseActionData });
        req.form = form;
        return next();
    } catch (error) {
        logger.error('CASE_FORM_FAILURE', { message: error.message, stack: error.stack });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new AuthenticationError('You are not authorised to work on this case'));
        }
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForStage = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_STAGE_FORM', { ...req.params });

    const { user } = req;
    try {
        const { form, error } = await getFormSchemaFromWorkflowService(req.requestId, req.params, user);
        if (error) {
            return next(error);
        } else {
            req.form = form;
            return next();
        }
    } catch (error) {
        logger.error('WORKFLOW_FORM_FAILURE', { message: error.message, stack: error.stack });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new AuthenticationError('You are not authorised to work on this case'));
        }
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getGlobalFormForCase = async (req, res, next) => {
    const logger = getLogger(req.requestId);
    logger.info('GET_GLOBAL_FORM', { ...req.params });

    try {
        const { form, error } = await getGlobalFormSchemaFromWorkflowService(req.params, req.user, req.requestId );
        if (error) {
            return next(error);
        }

        req.form = form;
        return next();
    } catch (error) {
        logger.error('WORKFLOW_FORM_FAILURE', { message: error.message, stack: error.stack });
        return next(new FormServiceError('Failed to fetch form'));
    }
};

const getFormForSomu = async (req, res, next) => {
    const { requestId,
        user,
        params: { action, caseId },
        somuType: { uuid, schema: { forms = {} } = {} } = {},
        somuItemData } = req;
    const logger = getLogger(requestId);

    try {
        const formName = forms[action];

        if (!formName) {
            return next(new FormServiceError(`Schema does not contain form definition for Somu Type: ${uuid}`));
        }

        const { form, error } = await getGlobalFormSchemaFromWorkflowService(
            { caseId: caseId, formId: formName }, user, requestId);
        if (error) {
            return next(error);
        }

        if (somuItemData) {
            form.data = { ...form.data, ...somuItemData };
        }

        req.form = form;

        return next();
    } catch (error) {
        logger.error('CASEWORK_SOMU_FORM_FAILURE', { message: error.message, stack: error.stack });
        return next(new FormServiceError(`Failed to fetch form for somuType: ${uuid} and action: ${action}`));
    }
};

module.exports = {
    getForm,
    getFormForAction,
    getFormForCase,
    getFormForStage,
    getFormForSomu,
    getGlobalFormForCase,
    hydrateFields,
    getSomuType,
    getSomuItemsByType,
    getSomuItem: getSomuItemData,
    getList
};
