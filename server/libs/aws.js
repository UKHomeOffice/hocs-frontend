const { S3Client } = require('@aws-sdk/client-s3');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const HttpsProxyAgent = require('https-proxy-agent');

const {
    S3: {
        ACCESS_KEY,
        SECRET_ACCESS_KEY,
        REGION, ENDPOINT,
        SSL_ENABLED,
        FORCE_PATH_STYLE,
        PROXY
    }
} = require('../config').forContext('AWS');

const CREDENTIALS = {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
};

const s3 = new S3Client({
    region: REGION,
    credentials: CREDENTIALS,
    forcePathStyle: FORCE_PATH_STYLE,
    endpoint: ENDPOINT,
    tls: SSL_ENABLED,
    ...(PROXY && { requestHandler: new NodeHttpHandler({
        httpsAgent: new HttpsProxyAgent(PROXY)
    }) })
});

module.exports = {
    s3
};
