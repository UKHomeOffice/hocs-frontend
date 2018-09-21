const { docsServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { DocumentError } = require('../models/error');

async function getOriginalDocument(req, res, next) {
    logger.info(`Requesting Original: ${req.params.documentId}`);
    res.setHeader('Cache-Control', 'max-age=86400');

    try {
        const response = await docsServiceClient.get(`/case/${req.params.caseId}/document/${req.params.documentId}/original`, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (e) {
        next(new DocumentError(e.message));
    }
}

async function getPdfDocument(req, res, next) {
    logger.info(`Requesting PDF: ${req.params.documentId}`);
    res.setHeader('Cache-Control', 'max-age=86400');

    try {
        const response = await docsServiceClient.get(`/case/${req.params.caseId}/document/${req.params.documentId}/pdf`, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (e) {
        next(new DocumentError(e.message));
    }
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
    getOriginalDocument,
    getPdfDocument,
    getDocumentList,
    apiGetDocumentList
};