const router = require('express').Router();
const { getOriginalDocument, getPdfDocument } = require('../middleware/document');
//const logger = require('../libs/logger');
const { DocumentError } = require('../models/error');
const { workflowServiceClient } = require('../libs/request');

// TODO: REFACTOR THIS, ALL OF IT, EURGH!

router.get('/:caseId/document/:documentId', getPdfDocument);

router.get('/:caseId/stage/:stageId/download/document/:documentId/pdf', getPdfDocument);

router.get('/:caseId/stage/:stageId/download/document/:documentId/original', getOriginalDocument);

//router.get('/:caseId/stage/:stageId/download/standard_line/:documentId', (req, res) => {
// logger.debug(`Requesting document: ${req.params.documentId}`);
//res.setHeader('Cache-Control', 'max-age=86400');
//const readStream = s3_trusted.getObject({
///    Bucket: 'cs-dev-trusted-s3',
//    Key: req.params.documentId
//}).createReadStream();
//readStream.on('error', e => {
//    if (e.statusCode === 404) {
//        next(new DocumentNotFoundError(`Unable to retrieve document: ${req.params.documentId}`));
//    } else {
//        next(new DocumentError(e.message));
//   }
//});
//readStream.pipe(res);
//});

router.get('/:caseId/stage/:stageId/download/template/:documentId', async (req, res, next) => {
    try {
        const response =  workflowServiceClient.get('/case/:caseId/template', { responseType: 'stream' });
        response.data.pipe(res);
    } catch (e) {
        next(new DocumentError(e.message));
    }
});

module.exports = router;