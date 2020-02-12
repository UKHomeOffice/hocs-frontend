const { workflowService, infoService, caseworkService } = require('../clients');
const actionTypes = require('./actions/types');
const { ActionError } = require('../models/error');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const listService = require('../services/list');
const uuid = require('uuid/v4');

function createDocumentSummaryObjects(form, type) {
    return form.schema.fields.reduce((reducer, field) => {
        if (field.component === 'add-document' && form.data[field.props.name]) {
            form.data[field.props.name].map(file => {
                reducer.push({
                    displayName: file.originalname,
                    type: type,
                    s3UntrustedUrl: file.key || 'key'
                });
            });
        }
        return reducer;
    }, []);
}

function createCaseRequest(type, form, documentTag) {
    return {
        type,
        dateReceived: form.data['DateReceived'],
        documents: createDocumentSummaryObjects(form, documentTag)
    };
}

function addDocumentRequest(form) {
    return { documents: createDocumentSummaryObjects(form, form.data['document_type']) };
}

function createCase(url, { caseType, form }, documentTag, headers) {
    return workflowService.post(url, createCaseRequest(caseType, form, documentTag), headers);
}

function addDocument(url, form, headers) {
    return workflowService.post(url, addDocumentRequest(form), headers);
}

function updateCase({ caseId, stageId, form }, headers) {
    return workflowService.post(`/case/${caseId}/stage/${stageId}`, { data: form.data }, headers);
}

async function handleActionSuccess(response, workflow, form) {
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
    ACTION: async ({ workflow, context, form, user }) => {
        let headers = {
            headers: User.createHeaders(user)
        };
        const logger = getLogger();
        try {
            if (form && form.action) {
                logger.info('ACTION', { action: form.action });
                let response;
                let clientResponse;
                switch (form.action) {
                    case actionTypes.CREATE_CASE: {
                        const listServiceInstance = listService.getInstance(uuid(), null);
                        const { documentLabels: documentTags } = await listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
                        response = await createCase('/case', { caseType: context, form }, documentTags[0], headers);
                        clientResponse = { summary: 'Created a new case ', link: `${response.data.reference}` };
                        return handleActionSuccess(clientResponse, workflow, form);
                    }
                    case actionTypes.CREATE_AND_ALLOCATE_CASE: {
                        const listServiceInstance = listService.getInstance(uuid(), null);
                        const { documentLabels: documentTags } = await listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
                        const { data: { reference } } = await createCase('/case', { caseType: context, form }, documentTags[0], headers);
                        const { data: { stages } } = await caseworkService.get(`/case/${encodeURIComponent(reference)}/stage`, headers);
                        const { caseUUID, uuid: stageUUID } = stages[0];
                        return handleActionSuccess({ callbackUrl: `/case/${caseUUID}/stage/${stageUUID}/allocate` }, workflow, form);
                    }
                    case actionTypes.BULK_CREATE_CASE: {
                        const listServiceInstance = listService.getInstance(uuid(), null);
                        const { documentLabels: documentTags } = await listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
                        response = await createCase('/case/bulk', { caseType: context, form }, documentTags[0], headers);
                        clientResponse = { summary: `Created ${response.data.count} new case${response.data.count > 1 ? 's' : ''}` };
                        return handleActionSuccess(clientResponse, workflow, form);
                    }
                    case actionTypes.ADD_STANDARD_LINE:
                        /* eslint-disable no-case-declarations */
                        const document = form.data.document[0];
                        const request = {
                            s3UntrustedUrl: document.key,
                            displayName: document.originalname,
                            topicUUID: form.data['topic'],
                            expires: form.data['expiry_date']
                        };
                        response = await infoService.post('/standardLine', request, headers);
                        clientResponse = { summary: 'Created a new standard line' };
                        return handleActionSuccess(clientResponse, workflow, form);
                    case actionTypes.ADD_TEMPLATE:
                        /* eslint-disable no-case-declarations */
                        var document1 = form.data.document[0];
                        var request1 = {
                            s3UntrustedUrl: document1.key,
                            displayName: document1.originalname,
                            caseType: form.data['caseType']
                        };
                        response = await infoService.post('/template', request1, headers);
                        clientResponse = { summary: 'Created a new template' };
                        return handleActionSuccess(clientResponse, workflow, form);
                    /* eslint-enable no-case-declarations */
                }
            } else {
                return handleActionSuccess(null, workflow, form);
            }
        } catch (error) {
            logger.error('ACTION_FAILURE', { action: form.action });
            throw new ActionError(error);
        }
    },
    CASE: async ({ caseId, stageId, entity, context, form, user }) => {
        let headers = {
            headers: User.createHeaders(user)
        };
        const logger = getLogger();
        try {
            if (form && form.action && entity) {
                logger.info('CASE_ACTION', { action: form.action, case: caseId });
                switch (form.action) {
                    case actionTypes.ADD_DOCUMENT:
                        await addDocument(`/case/${caseId}/document`, form, headers);
                        break;
                    case actionTypes.REMOVE_DOCUMENT:
                        if (!context) {
                            throw new ActionError('Unable to remove, no context provided');
                        }
                        await caseworkService.delete(`/case/${caseId}/document/${context}`, headers);
                        break;
                    case actionTypes.ADD_TOPIC:
                        await caseworkService.post(`/case/${caseId}/stage/${stageId}/topic`, { topicUUID: form.data['topic'] }, headers);
                        break;
                    case actionTypes.REMOVE_TOPIC:
                        if (!context) {
                            throw new ActionError('Unable to remove, no context provided');
                        }
                        await caseworkService.delete(`/case/${caseId}/stage/${stageId}/topic/${context}`, headers);
                        break;
                    case actionTypes.IS_MEMBER:
                        if (form.data['isMember'] === 'true') {
                            return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/member/add` });
                        } else {
                            return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/correspondent/details` });
                        }
                    case actionTypes.SELECT_MEMBER:
                        return ({ callbackUrl: `/case/${caseId}/stage/${stageId}/entity/member/${form.data['member']}/details` });
                    case actionTypes.ADD_CORRESPONDENT:
                    case actionTypes.ADD_MEMBER:
                        await caseworkService.post(`/case/${caseId}/stage/${stageId}/correspondent`, { ...form.data }, headers);
                        return ({ callbackUrl: `/case/${caseId}/stage/${stageId}` });
                    case actionTypes.REMOVE_CORRESPONDENT:
                        if (!context) {
                            throw new ActionError('Unable to remove, no context provided');
                        }
                        await caseworkService.delete(`/case/${caseId}/stage/${stageId}/correspondent/${context}`, headers);
                        break;
                    case actionTypes.UPDATE_CORRESPONDENT:
                        if (!context) {
                            throw new ActionError('Unable to update, no context provided');
                        }
                        await caseworkService.put(`/case/${caseId}/stage/${stageId}/correspondent/${context}`, { ...form.data }, headers);
                        break;
                    case actionTypes.ADD_CASE_NOTE:
                        await caseworkService.post(`/case/${caseId}/note`, { type: 'MANUAL', text: form.data['case-note'] }, headers);
                        break;
                }

                return ({ callbackUrl: `/case/${caseId}/stage/${stageId}` });
            }
        } catch (error) {
            logger.error('CASE_ACTION_FAILURE', { action: form.action, case: caseId });
            throw new ActionError('Failed to perform action', error.response.status);
        }
    },
    WORKFLOW: async ({ caseId, stageId, form, user }) => {
        let headers = {
            headers: User.createHeaders(user)
        };
        const logger = getLogger();
        logger.info('WORKFLOW_ACTION', { action: actionTypes.UPDATE_CASE, case: caseId });
        try {
            const response = await updateCase({ caseId, stageId, form }, headers);
            return handleWorkflowSuccess(response, { caseId, stageId });
        } catch (error) {
            logger.error('UPDATE_CASE_FAILURE', { case: caseId });
            throw new ActionError('Failed to update case', error.response.status);
        }
    }
};

const performAction = (type, options) => {
    return actions[type].call(this, options);
};

module.exports = {
    performAction
};
