const { docsServiceClient } = require('../libs/request');
const { getList } = require('../services/list');
const logger = require('../libs/logger');
const { DocumentError } = require('../models/error');

async function getOriginalDocument(req, res, next) {
    logger.debug(`Requesting Original: ${req.params.documentId}`);
    try {
        const response = await docsServiceClient.get(`/document/${req.params.documentId}/file`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.info(`Got Original Document: ${req.params.documentId} for Case: ${req.params.caseId}`));
        response.data.pipe(res);
    } catch (e) {
        logger.warn(`Failed getting Original Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
        logger.warn(e);
        next(new DocumentError(e.message));
    }
}

async function getPdfDocument(req, res, next) {
    logger.debug(`Requesting PDF: ${req.params.documentId}`);
    try {
        const response = await docsServiceClient.get(`/document/${req.params.documentId}/pdf`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.info(`Got PDF Document: ${req.params.documentId} for Case: ${req.params.caseId}`));
        response.data.pipe(res);
    } catch (e) {
        logger.warn(`Failed getting PDF Document: ${req.params.documentId} for Case: ${req.params.caseId}`);
        logger.warn(e);
        next(new DocumentError(e.message));
    }
}

async function getDocumentList(req, res, next) {
    try {
        const response = await getList('CASE_DOCUMENT_LIST', { caseId: req.params.caseId });
        logger.info(`Got document list for Case: ${req.params.caseId}`);
        res.locals.documents = response;
    } catch (e) {
        logger.warn(`Failed getting document list for Case: ${req.params.caseId}`);
        logger.warn(e);
        res.locals.documents = [];
    } finally {
        next();
    }
}

function apiGetDocumentList(req, res) {
    res.status(200).json(res.locals.documents);
}

module.exports = {
    getOriginalDocument,
    getPdfDocument,
    getDocumentList,
    apiGetDocumentList
};