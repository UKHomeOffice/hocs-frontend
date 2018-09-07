const { caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { DocumentError, DocumentNotFoundError } = require('../models/error');
const { s3 } = require('../libs/aws');

function getDocument(req, res, next) {
    logger.debug(`Requesting document: ${req.params.documentId}`);
    res.setHeader('Cache-Control', 'max-age=86400');
    const readStream = s3.getObject({
        Bucket: 'hocs-secure-bucket',
        Key: req.params.documentId
    }).createReadStream();

    readStream.on('error', e => {
        if (e.statusCode === 404) {
            next(new DocumentNotFoundError(`Unable to retrieve document: ${req.params.documentId}`));
        } else {
            next(new DocumentError(e.message));
        }
    });

    readStream.pipe(res);
}

async function getDocumentList(req, res, next) {
    try {
        const response = await caseworkServiceClient.get(`/case/${req.params.caseId}/document`);
        res.locals.documents = response.data;
        next();
    } catch (e) {
        next(new DocumentError('Unable to retrieve document list'));
    }
}

async function apiGetDocumentList(req, res, next) {
    try {
        const response = await caseworkServiceClient.get(`/case/${req.params.caseId}/document`, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (e) {
        next(new DocumentError('Unable to retrieve document list'));
    }
}

module.exports = {
    getDocument,
    getDocumentList,
    apiGetDocumentList
};