const aws = require('aws-sdk');
const uuid = require('uuid/v4');
const {
    S3: {
        ACCESS_KEY,
        SECRET_ACCESS_KEY,
        REGION, ENDPOINT,
        SSL_ENABLED,
        FORCE_PATH_STYLE,
        BUCKET_NAME
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

const params = {
    Bucket: BUCKET_NAME
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
     Location: "/examplebucket"
    }
    */
});

module.exports = {
    s3
};