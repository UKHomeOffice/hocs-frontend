const { getList } = require('../services/list');
const { docsServiceClient } = require('../libs/request');
const logger = require('../libs/logger');
const events = require('../models/events');
const { DocumentError } = require('../models/error');

async function getOriginalDocument(req, res, next) {
    const { documentId } = req.params;
    logger.info({ event: events.REQUEST_DOCUMENT_ORIGINAL, ...req.params });
    try {
        const response = await docsServiceClient.get(`/document/${documentId}/file`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug({ event: events.REQUEST_DOCUMENT_ORIGINAL_SUCCESS, ...req.params }));
        response.data.pipe(res);
    } catch (e) {
        logger.error({ event: events.REQUEST_DOCUMENT_ORIGINAL_FAILURE, ...req.params });
        next(new DocumentError('Unable to retrieve original document'));
    }
}

async function getPdfDocument(req, res, next) {
    const { documentId } = req.params;
    logger.info({ event: events.REQUEST_DOCUMENT_PDF, ...req.params });
    try {
        const response = await docsServiceClient.get(`/document/${documentId}/pdf`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug({ event: events.REQUEST_DOCUMENT_PDF_SUCCESS, ...req.params }));
        response.data.pipe(res);
    } catch (e) {
        logger.error({ event: events.REQUEST_DOCUMENT_PDF_FAILURE, ...req.params });
        next(new DocumentError('Unable to retrieve PDF document'));
    }
}

async function getPdfDocumentPreview(req, res, next) {
    const { documentId } = req.params;
    logger.info({ event: events.REQUEST_DOCUMENT_PREVIEW, ...req.params });
    try {
        const response = await docsServiceClient.get(`/document/${documentId}/pdf`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.debug({ event: events.REQUEST_DOCUMENT_PREVIEW_SUCCESS, ...req.params }));
        response.data.pipe(res);
    } catch (e) {
        logger.error({ event: events.REQUEST_DOCUMENT_PREVIEW_FAILURE, ...req.params });
        next(new DocumentError('Unable to retrieve document for PDF preview'));
    }
}

async function getDocumentList(req, res, next) {
    try {
        const response = await getList('CASE_DOCUMENT_LIST', { caseId: req.params.caseId });
        res.locals.documents = response;
    } catch (e) {
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
    getPdfDocumentPreview,
    getDocumentList,
    apiGetDocumentList
};