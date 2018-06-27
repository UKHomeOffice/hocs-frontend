const {s3} = require('../libs/aws');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid/v4');

const storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET || 'local-bucket',
    metadata: (req, file, callback) => {
        callback(null, {fieldName: file.fieldname});
    },
    key: (req, file, callback) => {
        callback(null, uuid());
    }
});

const upload = multer({storage});

module.exports = upload;