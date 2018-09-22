const { docsServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const { DocumentError } = require('../models/error');

async function getOriginalDocument(req, res, next) {
    logger.debug(`Requesting Original: ${req.params.documentId}`);

    try {
        const response = await docsServiceClient.get(`/document/${req.params.documentId}/file`, { responseType: 'stream' });
        if(response && response.status === 200) {
            res.setHeader('Cache-Control', 'max-age=86400');
        }
        response.data.pipe(res);
    } catch (e) {
        logger.warn(`Failed getting Original Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
        logger.warn(e);
        next(new DocumentError(e.message));
    } finally {
        logger.info(`Got Original Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
    }
}

async function getPdfDocument(req, res, next) {
    logger.debug(`Requesting PDF: ${req.params.documentId}`);

    try {
        const response = await docsServiceClient.get(`/document/${req.params.documentId}/pdf`, { responseType: 'stream' });
        if(response && response.status === 200) {
            res.setHeader('Cache-Control', 'max-age=86400');
        }
        response.data.pipe(res);
    } catch (e) {
        logger.warn(`Failed getting PDF Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
        logger.warn(e);
        next(new DocumentError(e.message));
    } finally {
        logger.info(`Got PDF Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
    }
}

async function getDocumentList(req, res, next) {
    logger.debug(`Fetching document list for Case: ${req.params.caseId}`);

    try {
        const response = await docsServiceClient.get(`/document/case/${req.params.caseId}`);
        res.locals.documents = response.data.documents;
    } catch (e) {
        logger.warn(`Failed getting document list for Case: ${req.params.caseId}`);
        logger.warn(e);
        res.locals.documents = [];
    } finally {
        logger.info(`Got document list for Case: ${req.params.caseId}`);
        next();
    }
}

async function apiGetDocumentList(req, res) {
    logger.debug(`Fetching api document list for Case: ${req.params.caseId}`);

    try {
        const response = await docsServiceClient.get(`/document/case/${req.params.caseId}`);
        res.send(response.data);
    } catch (e) {
        logger.warn(`Failed getting api document list for Case: ${req.params.caseId}`);
        logger.warn(e);
        res.send({ documents: [] });
    } finally {
        logger.info(`Got api document list for Case: ${req.params.caseId}`);
    }
}

module.exports = {
    getOriginalDocument,
    getPdfDocument,
    getDocumentList,
    apiGetDocumentList
};