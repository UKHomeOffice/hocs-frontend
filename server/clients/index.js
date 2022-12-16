const { createClient } = require('../libs/request');

const {
    CASEWORK_SERVICE,
    WORKFLOW_SERVICE,
    INFO_SERVICE,
    TEMPLATES_SERVICE,
    DOCUMENT_SERVICE
} = require('../config').forContext('server');

const caseworkService = createClient({
    baseURL: CASEWORK_SERVICE
});

const workflowService = createClient({
    baseURL: WORKFLOW_SERVICE
});

const infoService = createClient({
    baseURL: INFO_SERVICE
});

const templatesService = createClient({
    baseURL: TEMPLATES_SERVICE
});

const documentService = createClient({
    baseURL: DOCUMENT_SERVICE
});

module.exports = {
    caseworkService,
    workflowService,
    infoService,
    templatesService,
    documentService
};
