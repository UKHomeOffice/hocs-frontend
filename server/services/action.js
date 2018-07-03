const logger = require('../libs/logger');
const {WORKFLOW_SERVICE} = require('../config').forContext('server');
const uuid = require('uuid/v4');
const axios = require('axios');
const path = require('path');

const actions = {
    create: ({form, user}, callback) => {
        // TODO: Post to create case
        const url = `${WORKFLOW_SERVICE}/case`;
        const createCaseRequest = {
            caseType: form.data['case-type']
        };
        const headers = null;
        axios.post(url, createCaseRequest, headers)
            .then(response => {
                const stage = 'document';
                callback(`/case/${response.data.caseReference}/${stage}`, null);
            })
            .catch(err => {
                logger.error(err);
                callback(null, 'Failed to perform action');
            });
    },
    document: ({form, caseId}, callback) => {
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
        logger.debug(form.action);
        axios.post(`${WORKFLOW_SERVICE}/case/${caseId}/${form.schema.callback.value}`, {documents})
            .then(response => {
                const {stageId} = response.data;
                callback(`/case/${caseId}/stage/${stageId}`, null);
            })
            .catch(err => {
                logger.error(err);
                callback(null, 'Failed to perform action');
            });
    },
    workflow: ({caseId, stageId, form}, callback) => callback('/')
};

const performAction = (action, options, callback) => {
    actions[action].call(this, options, callback);
};

module.exports = {
    performAction
};