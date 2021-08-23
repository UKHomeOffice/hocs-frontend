const axios = require('axios');
const axiosRetry = require('axios-retry');
const https = require('https');
const fs = require('fs');
const getLogger = require('../libs/logger');
const { backendRequestRetries } = require('../config');

const isProduction = process.env.NODE_ENV === 'production';

axios.defaults.headers.common['Accept-encoding'] = 'gzip';

const getHttpsClient = () => {
    return new https.Agent({
        cert: fs.readFileSync('/certs/tls.pem'),
        key: fs.readFileSync('/certs/tls-key.pem'),
        ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt'),
        rejectUnauthorized: false
    });
};

function createClient({ baseURL, auth }) {

    const logger = getLogger();

    const client = axios.create({
        baseURL,
        auth,
        httpsAgent: isProduction ? getHttpsClient() : null
    });

    //Retry 3 times with 5 second gaps
    axiosRetry(client, { retries: backendRequestRetries, retryDelay: () => { return 5000; } });

    //Warn about retries
    client.interceptors.request.use(request => {
        if('axios-retry' in request){
            logger.warn('REQUESTRETRY', { url: request.url, retryCount: request['axios-retry'].retryCount,  xCorrelationId: request.headers['X-Correlation-Id'] });
        }
        return request;
    });

    return {
        get: (endpoint, headers) => client.get(endpoint, headers),
        post: (endpoint, body, headers) => client.post(endpoint, body, headers),
        delete: (endpoint, headers) => client.delete(endpoint, headers),
        put: (endpoint, body, headers) => client.put(endpoint, body, headers)
    };

}

module.exports = {
    createClient
};
