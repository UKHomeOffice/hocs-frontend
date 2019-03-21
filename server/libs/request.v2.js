const axios = require('axios');
const https = require('https');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const getHttpsClient = () => {
    return new https.Agent({
        cert: fs.readFileSync('/certs/tls.pem'),
        key: fs.readFileSync('/certs/tls-key.pem'),
        ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt'),
        rejectUnauthorized: false
    });
};

function createClient({ baseURL, auth }) {

    const client = axios.create({
        baseURL,
        auth,
        httpsAgent: isProduction ? getHttpsClient() : null
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