const logger = require('../libs/logger');
const uuid = require('uuid/v4');
const axios = require('axios');
const path = require('path');

const workflowService = process.env.WORKFLOW_SERVICE || 'http://localhost:8081';

const actions = {
    create: ({form, user}, callback) => {
        // TODO: Post to create case
        const url = `${workflowService}/case`;
        const createCaseRequest = {
            caseType: form.data['case-type']
        };
        const headers = null;
        axios.post(url, createCaseRequest, headers)
            .then(response => {
                const stage = 'document';
                callback(`/case/${response.data.caseId}/${stage}`, null);
            })
            .catch(err => {
                logger.error(err);
                callback(null, 'Failed to perform action');
            });
    },
    document: ({form, user}, callback) => {
        // TODO: Post S3 URLs to workflow service
        const documents = form.schema.fields.reduce((reducer, field) => {
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
        const url = `${workflowService}/case/someId/document`;
        axios.post(url, documents)
            .then(response => {
                callback('/', null);
            })
            .catch(err => {
                logger.error(err);
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