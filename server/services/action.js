const { workflowServiceClient } = require('../libs/request');
const actionTypes = require('./actions/types');
const { ActionError } = require('../models/error');
const logger = require('../libs/logger');

function createDocumentSummaryObjects(form, type) {
    return form.schema.fields.reduce((reducer, field) => {
        if (field.component === 'add-document') {
            if (form.data[field.props.name]) {
                form.data[field.props.name].map(file => {
                    reducer.push({
                        displayName: file.originalname,
                        type: type,
                        s3UntrustedUrl: file.key || 'key'
                    });
                });
            }
        }
        return reducer;
    }, []);
}

function createCaseRequest(type, form) {
    return {
        type,
        dateReceived: form.data['DateReceived'],
        documents: createDocumentSummaryObjects(form, 'ORIGINAL')
    };
}

function addDocumentRequest(form) {
    return { documents: createDocumentSummaryObjects(form, form.data['document_type']) };
}

function createCase(url, { caseType, form }) {
    return workflowServiceClient.post(url, createCaseRequest(caseType, form));
}

function addDocument(url, form) {
    return workflowServiceClient.post(url, addDocumentRequest(form));
}

function updateCase({ caseId, stageId, form }) {
    return workflowServiceClient.post(`/case/${caseId}/stage/${stageId}`, { data: form.data });
}

function handleActionSuccess(response, workflow, form) {
    const { next, data } = form;
    if (response && response.callbackUrl) {
        return { callbackUrl: response.callbackUrl };
    }
    if (next && next.action) {
        if (next.action === 'CONFIRMATION_SUMMARY') {
            return { confirmation: response };
        }
        if (next.context) {
            const context = data[next.context.field];
            return { callbackUrl: `/action/${workflow}/${context}/${next.action}` };
        }
        return { callbackUrl: `/action/${workflow}/${next.action}` };
    } else {
        return { callbackUrl: '/' };
    }
}

function handleWorkflowSuccess(response, { caseId, stageId }) {
    if (response.data && response.data.form) {
        return { callbackUrl: `/case/${caseId}/stage/${stageId}` };
    } else {
        return { callbackUrl: '/' };
    }
}

const actions = {
    ACTION: async ({ workflow, context, form }) => {
        if (form && form.action) {
            switch (form.action) {
            case actionTypes.CREATE_CASE:
                try {
                    const response = await createCase('/case', { caseType: context, form });
                    const clientResponse = { summary: `Created a new case: ${response.data.reference}` };
                    return handleActionSuccess(clientResponse, workflow, form);
                } catch (e) {
                    throw new ActionError(e);
                }
            case actionTypes.BULK_CREATE_CASE: {
                try {
                    const response = await createCase('/case/bulk', { caseType: context, form });
                    const clientResponse = { summary: `Created ${response.data.count} new case${response.data.count > 1 ? 's' : ''}` };
                    return handleActionSuccess(clientResponse, workflow, form);
                } catch (e) {
                    throw new ActionError(e);
                }
            }
            default: {
                throw new ActionError('Unsupported action');
            }
            }
        } else {
            return handleActionSuccess(null, workflow, form);
        }
    },
    CASE: async ({ caseId, stageId, entity, context, form }) => {
        try {
            if (form && form.action && entity) {
                logger.debug(`Performing action ${form.action} for case ${caseId}`);
                switch (form.action) {
                case actionTypes.ADD_DOCUMENT:
                    await addDocument(`/case/${caseId}/document`, form);
                    break;
                case actionTypes.REMOVE_DOCUMENT:
                    if (!context) {
                        throw new ActionError('Unable to remove, no context provided');
                    }
                    await workflowServiceClient.delete(`/case/${caseId}/document/${context}`);
                    break;
                case actionTypes.ADD_TOPIC:
                    await workflowServiceClient.post(`/case/${caseId}/topic`, { topicUUID: form.data['topic'] });
                    break;
                case actionTypes.REMOVE_TOPIC:
                    if (!context) {
                        throw new ActionError('Unable to remove, no context provided');
                    }
                    await workflowServiceClient.delete(`/case/${caseId}/topic/${context}`);
                    break;
                case actionTypes.IS_MEMBER:
                    if (form.data['isMember'] === 'true') {
                        return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/member/add` });
                    } else {
                        return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/correspondent/details` });
                    }
                case actionTypes.SELECT_MEMBER:
                    return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/member/${form.data['member']}/details` });
                case actionTypes.ADD_CORRESPONDENT: case actionTypes.ADD_MEMBER:
                    await workflowServiceClient.post(`/case/${caseId}/correspondent`, { ...form.data });
                    return ({ callbackUrl: `/case/${caseId}/stage/${stageId}` });
                case actionTypes.REMOVE_CORRESPONDENT:
                    if (!context) {
                        throw new ActionError('Unable to remove, no context provided');
                    }
                    await workflowServiceClient.delete(`/case/${caseId}/correspondent/${context}`);
                    break;
                }
                return ({ callbackUrl: `/case/${caseId}/stage/${stageId}` });
            }
        } catch (e) {
            throw new ActionError(e);
        }
    },
    WORKFLOW: async ({ caseId, stageId, form }) => {
        try {
            const response = await updateCase({ caseId, stageId, form });
            return handleWorkflowSuccess(response, { caseId, stageId });
        } catch (e) {
            throw new ActionError(e);
        }
    }
};

const performAction = (type, options) => {
    return actions[type].call(this, options);
};

module.exports = {
    performAction
};