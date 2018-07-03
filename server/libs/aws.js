const aws = require('aws-sdk');
const uuid = require('uuid/v4');
const {
    S3: {
        ACCESS_KEY,
        SECRET_ACCESS_KEY,
        REGION, ENDPOINT,
        SSL_ENABLED,
        FORCE_PATH_STYLE
    }
} = require('../config').forContext('AWS');

const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    endpoint: ENDPOINT,
    region: REGION,
    sslEnabled: SSL_ENABLED,
    s3ForcePathStyle: FORCE_PATH_STYLE
});

module.exports = {
    s3
};