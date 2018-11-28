const { WORKFLOW_SERVICE, WORKFLOW_BASIC_AUTH, CASEWORK_SERVICE, INFO_SERVICE, DOCUMENT_SERVICE } = require('../config').forContext('server');
const { isProduction } = require('../config');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const getHttpsClient = () => {
    return new https.Agent({
        cert: fs.readFileSync('/certs/tls.pem'),
        key: fs.readFileSync('/certs/tls-key.pem'),
        ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt'),
        rejectUnauthorized: false
    });
};

const workflowServiceClient = axios.create({
    baseURL: WORKFLOW_SERVICE,
    auth: WORKFLOW_BASIC_AUTH,
    httpsAgent: isProduction ? getHttpsClient() : null
});

const caseworkServiceClient = axios.create({
    baseURL: CASEWORK_SERVICE,
    auth: WORKFLOW_BASIC_AUTH,
    httpsAgent: isProduction ? getHttpsClient() : null,
    headers: {
        'X-Auth-UserId': req.user.id,
        'X-Auth-Roles': req.user.roles.join(),
        'X-Auth-Groups': req.user.groups.join()
    }
});

const infoServiceClient = axios.create({
    baseURL: INFO_SERVICE,
    auth: WORKFLOW_BASIC_AUTH,
    httpsAgent: isProduction ? getHttpsClient() : null
});

const docsServiceClient = axios.create({
    baseURL: DOCUMENT_SERVICE,
    auth: WORKFLOW_BASIC_AUTH,
    httpsAgent: isProduction ? getHttpsClient() : null
});

module.exports = {
    workflowServiceClient,
    caseworkServiceClient,
    infoServiceClient,
    docsServiceClient
};