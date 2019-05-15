const { createClient } = require('../libs/request');

const {
    CASEWORK_SERVICE,
    WORKFLOW_SERVICE,
    INFO_SERVICE,
    DOCUMENT_SERVICE,
    TEMPLATES_SERVICE,
    WORKFLOW_BASIC_AUTH
} = require('../config').forContext('server');

const caseworkService = createClient({
    baseURL: CASEWORK_SERVICE,
    auth: WORKFLOW_BASIC_AUTH
});

const workflowService = createClient({
    baseURL: WORKFLOW_SERVICE,
    auth: WORKFLOW_BASIC_AUTH
});

const infoService = createClient({
    baseURL: INFO_SERVICE,
    auth: WORKFLOW_BASIC_AUTH
});

const documentService = createClient({
    baseURL: DOCUMENT_SERVICE,
    auth: WORKFLOW_BASIC_AUTH
});

const templatesService = createClient({
    baseURL: TEMPLATES_SERVICE,
    auth: WORKFLOW_BASIC_AUTH
});

module.exports = {
    caseworkService,
    workflowService,
    infoService,
    documentService,
    templatesService
};