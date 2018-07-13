const logger = require('../libs/logger');
const { workflowServiceClient } = require('../libs/request');

const actions = {
    create: ({ form }, callback) => {
        const caseType = form.data['case-type'];
        const stage = 'document';
        callback(`/action/${ caseType }/${ stage }`, null);
    },
    bulk: ({ form }, callback) => {
        const caseType = form.data['case-type'];
        const stage = 'bulkDocument';
        callback(`/action/${ caseType }/${ stage }`, null);
    },
    document: ({ form, caseId }, callback) => {
        // TODO: Post S3 URLs to workflow service
        const documentSummaries = form.schema.fields.reduce((reducer, field) => {
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
        logger.debug(form.action);
        const createCaseRequest = {
            type:  caseId,
            documents: documentSummaries
        };
        workflowServiceClient.post('/case', createCaseRequest)
            .then(() => {
                callback('/', null);
            })
            .catch(err => {
                logger.error(`${err.message}`);
                callback(null, 'Failed to perform action');
            });
    },
    bulkDocument: ({ form, caseId }, callback) => {
        // TODO: Post S3 URLs to workflow service
        const documentSummaries = form.schema.fields.reduce((reducer, field) => {
            if (field.component === 'bulkAddDocument') {
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
        logger.debug(form.action);
        const createBulkCaseRequest = {
            type:  caseId,
            documents: documentSummaries
        };
        workflowServiceClient.post('/case/bulk', createBulkCaseRequest)
            .then(() => {
                callback('/', null);
            })
            .catch(err => {
                logger.error(`${err.message}`);
                callback(null, 'Failed to perform action');
            });
    },
    workflow: ({ caseId, stageId, form }, callback) => {
        workflowServiceClient.post(`/case/${caseId}/stage/${stageId}`, { data: form.data })
            .then(response => {
                if (response.data && response.data.screenName !== 'FINISH') {
                    return callback(`/case/${caseId}/stage/${stageId}`, null);
                } else {
                    return callback('/', null);
                }
            })
            .catch(err => {
                logger.error(`${err.message}`);
                callback(null, 'Failed to perform action');
            });
    }
};

const performAction = (action, options, callback) => {
    actions[action].call(this, options, callback);
};

module.exports = {
    performAction
};