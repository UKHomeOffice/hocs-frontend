const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');
const { CREATE_CASE, CREATE_BULK_CASE } = require('./actions/types');

function createDocumentSummaryObjects(form) {
    return form.schema.fields.reduce((reducer, field) => {
        if (field.component === 'add-document') {
            form.data[field.props.name].map(file => {
                reducer.push({
                    displayName: file.originalname,
                    type: field.props.documentType,
                    s3UntrustedUrl: file.location || 'location'
                });
            });
        }
        return reducer;
    }, []);
}

function createCaseRequest(type, form) {
    return {
        type,
        documents: createDocumentSummaryObjects(form)
    };
}

function createCase(url, { caseType, form }) {
    return workflowServiceClient.post(url, createCaseRequest(caseType, form));
}

function updateCase({ caseId, stageId, form }) {
    return workflowServiceClient.post(`/case/${caseId}/stage/${stageId}`, { data: form.data });
}

function handleActionSuccess(workflow, form) {
    const { next, data } = form;
    if (next && next.action) {
        if (next.context) {
            const context = data[next.context.field];
            return { callbackUrl: `/action/${workflow}/${context}/${next.action}` };
        }
        return { callbackUrl: `/action/${workflow}/${next.action}` };
    } else {
        return { callbackUrl: '/' };
    }
}

function handleWorkflowSuccess(response, { stageId, caseId }, callback) {
    if (response.data && response.data.screenName !== 'FINISH') {
        return callback(null, `/stage/${stageId}/case/${caseId}`);
    } else {
        return { callbackUrl: '/' };
    }
}

function handleActionFailure(error) {
    logger.error(error);
    return { error };
}

function handleWorkflowError(error) {
    logger.error(error);
    return { error };
}

const actions = {
    ACTION: async ({ workflow, context, form }) => {
        if (form) {
            switch (form.action) {
            case CREATE_CASE:
                try {
                    await createCase('/case', { caseType: context, form });
                    return handleActionSuccess(workflow, form);
                } catch (err) {
                    return handleActionFailure(err);
                }
            case CREATE_BULK_CASE: {
                try {
                    await createCase('/case/bulk', { caseType: context, form });
                    return handleActionSuccess(workflow, form);
                } catch (err) {
                    return handleActionFailure(err);
                }
            }
            default: {
                return handleActionSuccess(workflow, form);
            }
            }
        }
    },
    CASE: async ({ entity, action }) => {
        if (entity && action) {
            // Handle case event
        }
    },
    WORKFLOW: async ({ caseId, stageId, entity, action, form }) => {
        if (entity && action) {
            // Handle case event
        }
        // Update stage

        try {
            const response = await updateCase({ caseId, stageId, form });
            return handleWorkflowSuccess(response, { stageId, caseId });
        } catch (err) {
            return handleWorkflowError(err);
        }
    }
};

const performAction = (type, options) => {
    return actions[type].call(this, options);
};

module.exports = {
    performAction
};