const {s3} = require('../libs/aws');
const {S3: {BUCKET_NAME}} = require('../config').forContext('AWS');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid/v4');

const storage = multerS3({
    s3,
    bucket: BUCKET_NAME,
    metadata: (req, file, callback) => {
        callback(null, {fieldName: file.fieldname});
    },
    key: (req, file, callback) => {
        callback(null, uuid());
    }
});

const upload = multer({storage});

module.exports = upload;