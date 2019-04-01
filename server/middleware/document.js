const { documentService } = require('../clients');
const getLogger = require('../libs/logger');
const { DocumentError } = require('../models/error');

async function getOriginalDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    logger.info('REQUEST_DOCUMENT_ORIGINAL', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/file`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_ORIGINAL_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_ORIGINAL_FAILURE', { ...req.params });
        next(new DocumentError('Unable to retrieve original document'));
    }
}

async function getPdfDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    logger.info('REQUEST_DOCUMENT_PDF', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/pdf`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PDF_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PDF_FAILURE', { ...req.params });
        next(new DocumentError('Unable to retrieve PDF document'));
    }
}

async function getPdfDocumentPreview(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    logger.info('REQUEST_DOCUMENT_PREVIEW', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/pdf`, { responseType: 'stream' });
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PREVIEW_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PREVIEW_FAILURE', { ...req.params });
        next(new DocumentError('Unable to retrieve document for PDF preview'));
    }
}

async function getDocumentList(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        const response = await req.listService.fetch('CASE_DOCUMENT_LIST', { ...req.params });
        res.locals.documents = response;
    } catch (error) {
        logger.info('CASE_DOCUMENT_LIST_RETURN_EMPTY');
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