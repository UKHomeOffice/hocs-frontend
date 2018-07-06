const {WORKFLOW_SERVICE, WORKFLOW_BASIC_AUTH} = require('../config').forContext('server');
const {isProduction} = require('../config');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const getHttpsClient = () => {
    return new https.Agent({
        // DSP/ACP certs do not include root ca - so we can not validate entire chain that OpenSSL requires
        // so until we have entire chain in bundle lets not be strict
        ca: fs.readFileSync('/certs/tls.pem'),
        rejectUnauthorized: false
    });
};

const workflowServiceClient = axios.create({
    baseURL: WORKFLOW_SERVICE,
    auth: WORKFLOW_BASIC_AUTH,
    httpsAgent: isProduction ? getHttpsClient() : null
});

module.exports = {
    workflowServiceClient
};