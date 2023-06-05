const { caseworkService, documentService } = require('../clients');
const getLogger = require('../libs/logger');
const { DocumentError, AuthenticationError } = require('../models/error');
const User = require('../models/user');

/*
 * This method is used to retrieve the document information from the casework service.
 * This is effectively acting as a permission check, to validate the user has access to the document.
 */
async function getDocumentInfo(req, res, next) {
    const logger = getLogger(req.requestId);
    const { caseId, documentId } = req.params;
    let options = {
        headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId },
        responseType: 'stream'
    };

    logger.info('REQUEST_DOCUMENT_INFORMATION', { ...req.params });
    try {
        await caseworkService.get(`/case/${caseId}/document/${documentId}`, options);
        return next();
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_ORIGINAL_FAILURE', { ...req.params });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new AuthenticationError('You are not authorised to work on this case'));
        }
        return next(new DocumentError('Unable to retrieve document information'));
    }
}

async function getOriginalDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    let options = {
        headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId },
        responseType: 'stream'
    };
    logger.info('REQUEST_DOCUMENT_ORIGINAL', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/file`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_ORIGINAL_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_ORIGINAL_FAILURE', { ...req.params });
        return next(new DocumentError('Unable to retrieve original document'));
    }
}

async function getPdfDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    logger.info('REQUEST_DOCUMENT_PDF', { ...req.params });

    let options = {
        headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId },
        responseType: 'stream'
    };

    try {
        const response = await documentService.get(`/document/${documentId}/pdf`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PDF_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PDF_FAILURE', { ...req.params });
        return next(new DocumentError('Unable to retrieve PDF document'));
    }
}

async function getPdfDocumentPreview(req, res, next) {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;

    let options = {
        headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId } ,
        responseType: 'stream'
    };

    logger.info('REQUEST_DOCUMENT_PREVIEW', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/pdf`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PREVIEW_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PREVIEW_FAILURE', { ...req.params });
        return next(new DocumentError('Unable to retrieve document for PDF preview'));
    }
}

async function getDocumentList(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        const response = await req.listService.fetch('CASE_DOCUMENT_LIST', { ...req.params });
        res.locals.documents = response;
    } catch (error) {
        res.locals.documents = [];
        if (error.response !== undefined && error.response.status === 401) {
            return next(new AuthenticationError('You are not authorised to work on this case'));
        }
        logger.info('CASE_DOCUMENT_LIST_RETURN_EMPTY');
    }
    return next();
}

function apiGetDocumentList(req, res) {
    res.status(200).json(res.locals.documents);
}

module.exports = {
    getDocumentInfo,
    getOriginalDocument,
    getPdfDocument,
    getPdfDocumentPreview,
    getDocumentList,
    apiGetDocumentList
};
