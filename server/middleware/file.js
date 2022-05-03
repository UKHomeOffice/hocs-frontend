const querystring = require('querystring'); // node core module
const { s3 } = require('../libs/aws');
const isProduction = require('../config').isProduction;
const { S3: { BUCKET_NAME, SSE_KEY } } = require('../config').forContext('AWS');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuid } = require('uuid');

const sseConfiguration = {
    serverSideEncryption: 'aws:kms',
    sseKmsKeyId: SSE_KEY
};

const storage = multerS3({
    s3,
    bucket: BUCKET_NAME,
    metadata: (req, file, callback) => {
        callback(null, { originalName: querystring.escape(file.originalname) });
    },
    key: (req, file, callback) => {
        callback(null, uuid());
    },
    ...(isProduction ? sseConfiguration : {})
});

const fileMiddleware = multer({ storage });

module.exports = {
    fileMiddleware,
    secureFileMiddleware: fields => fileMiddleware.fields(fields)
};
