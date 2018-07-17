const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');
const { CREATE_CASE, CREATE_BULK_CASE } = require('./actions/types');

function createDocumentSummaryObjects(form) {
    return form.schema.fields.reduce((reducer, field) => {
        if (field.component === 'addDocument') {
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

function handleActionSuccess(workflow, form, callback) {
    const { next, data } = form;
    if (next && next.action) {
        if (next.context) {
            const context = data[next.context.field];
            return callback(`/action/${workflow}/${context}/${next.action}`, null);
        }
        return callback(`/action/${workflow}/${next.action}`, null);
    } else {
        return callback('/', null);
    }
}

function handleWorkflowSuccess(response, { stageId, caseId }, callback) {
    if (response.data && response.data.screenName !== 'FINISH') {
        return callback(`/stage/${stageId}/case/${caseId}`, null);
    } else {
        return callback('/', null);
    }
}

function handleActionFailure(error) {
    logger.error(error);
}

function handleWorkflowErrror(error) {
    logger.error(error);
}

const actions = {
    ACTION: (({ workflow, context, form }, callback) => {
        if (form && form.action) {
            switch (form.action) {
            case CREATE_CASE: {
                createCase('/case', { caseType: context, form })
                    .then(() => handleActionSuccess(workflow, form, callback))
                    .catch(err => handleActionFailure(err));
                break;
            }
            case CREATE_BULK_CASE: {
                createCase('/case/bulk', { caseType: context, form })
                    .then(() => handleActionSuccess(workflow, form, callback))
                    .catch(err => handleActionFailure(err));
                break;
            }
            default: {
                callback();
            }
            }
        }
        handleActionSuccess(workflow, form, callback);
    }),
    CASE: (({ entity, action }) => {
        if (entity && action) {
            // Handle case event
        }
    }),
    WORKFLOW: (({ caseId, stageId, entity, action, form }, callback) => {
        if (entity && action) {
            // Handle case event
        }
        // Update stage
        updateCase({ caseId, stageId, form })
            .then(res => handleWorkflowSuccess(res, { stageId, caseId }, callback))
            .catch(err => handleWorkflowErrror(err));
    })
};

const performAction = (type, options, callback) => {
    actions[type].call(this, options, callback);
};

module.exports = {
    performAction
};