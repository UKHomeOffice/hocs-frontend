const aws = require('aws-sdk');

const {
    S3: {
        ACCESS_KEY,
        SECRET_ACCESS_KEY,
        REGION, ENDPOINT,
        SSL_ENABLED,
        FORCE_PATH_STYLE,
        PROXY
    },
    S3_TRUSTED: {
        TRUSTED_ACCESS_KEY,
        TRUSTED_SECRET_ACCESS_KEY,
        TRUSTED_REGION,
        TRUSTED_ENDPOINT,
        TRUSTED_SSL_ENABLED,
        TRUSTED_FORCE_PATH_STYLE,
        TRUSTED_PROXY
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

const s3_trusted = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: TRUSTED_ACCESS_KEY,
    secretAccessKey: TRUSTED_SECRET_ACCESS_KEY,
    endpoint: TRUSTED_ENDPOINT,
    region: TRUSTED_REGION,
    sslEnabled: TRUSTED_SSL_ENABLED,
    s3ForcePathStyle: TRUSTED_FORCE_PATH_STYLE,
    httpOptions: {
        proxy: TRUSTED_PROXY
    }
});

module.exports = {
    s3, s3_trusted
};