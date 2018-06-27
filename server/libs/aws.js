const aws = require('aws-sdk');
const uuid = require('uuid/v4');

const isProduction = process.env.NODE_ENV === 'production';

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY || 'UNSET',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'UNSET',
    endpoint: isProduction ? null : 'http://localhost:4572',
    region: isProduction ? process.env.S3_REGION : null,
    sslEnabled: isProduction,
    s3ForcePathStyle: !isProduction
});

module.exports = {
    s3
};