const logger = require('../libs/logger');
const uuid = require('uuid/v4');
const path = require('path');
const {workflowServiceClient} = require('../libs/request');

const actions = {
    create: ({form, user}, callback) => {
        const createCaseRequest = {
            type: form.data['case-type']
        };
        workflowServiceClient.post('/case', createCaseRequest)
            .then(response => {
                const stage = 'document';
                callback(`/case/${response.data.uuid}/${stage}`, null);
            })
            .catch(err => {
                logger.error(`${err.message}`);
                callback(null, 'Failed to perform action');
            });
    },
    document: ({form, caseId}, callback) => {
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
        workflowServiceClient.post(`/case/${caseId}/${form.schema.callback.value}`, {documentSummaries})
            .then(response => {
                const {stageId} = response.data;
                callback(`/`, null);
            })
            .catch(err => {
                logger.error(`${err.message}`);
                callback(null, 'Failed to perform action');
            });
    },
    workflow: ({caseId, stageId, form}, callback) => {
        workflowServiceClient.post(`/case/${caseId}/stage/${stageId}`, {data: form.data})
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