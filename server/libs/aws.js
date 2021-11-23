const aws = require('aws-sdk');

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

const s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    endpoint: ENDPOINT,
    region: REGION,
    sslEnabled: SSL_ENABLED,
    s3ForcePathStyle: FORCE_PATH_STYLE,
    httpOptions: {
        proxy: PROXY
    }
});

module.exports = {
    s3
};