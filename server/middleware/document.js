const { docsServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { DocumentError, DocumentNotFoundError } = require('../models/error');
const { s3_trusted } = require('../libs/aws');

function getDocument(req, res, next) {
    logger.info(`Requesting document: ${req.params.documentId}`);
    res.setHeader('Cache-Control', 'max-age=86400');
    const readStream = s3_trusted.getObject({
        Bucket: 'cs-dev-trusted-s3',
        Key: req.params.documentId
    }).createReadStream();

    readStream.on('error', e => {
        if (e.statusCode === 404) {
            logger.warn(e);
            next(new DocumentNotFoundError(`Unable to retrieve document: ${req.params.documentId}`));
        } else {
            logger.warn(e);
            next(new DocumentError(e.message));
        }
    });
    logger.info(`loaded document: ${req.params.documentId}`);

    readStream.pipe(res);
}

async function getDocumentList(req, res, next) {
    logger.info(`getting document list: ${req.params.caseId}`);

    try {
        const response = await docsServiceClient.get(`/case/${req.params.caseId}/document`);
        res.locals.documents = response.data.documents;
    } catch (e) {
        logger.warn(e);
        res.locals.documents = [];
    } finally {
        next();
    }
}

async function apiGetDocumentList(req, res) {
    try {
        const response = await docsServiceClient.get(`/case/${req.params.caseId}/document`);
        res.send(response.data);
    } catch (e) {
        logger.warn(e);
        res.send({ documents: [] });
    }
}

module.exports = {
    getDocument,
    getDocumentList,
    apiGetDocumentList
};