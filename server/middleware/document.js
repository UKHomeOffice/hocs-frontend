const { caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const { DocumentError, PermissionError } = require('../models/error');
const User = require('../models/user');

async function getOriginalDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { caseId, documentId } = req.params;
    let options = {
        headers: User.createHeaders(req.user),
        responseType: 'stream'
    };
    logger.info('REQUEST_DOCUMENT_ORIGINAL', { ...req.params });
    try {
        const response = await caseworkService.get(`/case/${caseId}/document/${documentId}/file`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_ORIGINAL_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_ORIGINAL_FAILURE', { ...req.params });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
        return next(new DocumentError('Unable to retrieve original document'));
    }
}

async function getPdfDocument(req, res, next) {
    const logger = getLogger(req.requestId);
    const { caseId, documentId } = req.params;
    logger.info('REQUEST_DOCUMENT_PDF', { ...req.params });

    let options = {
        headers: User.createHeaders(req.user),
        responseType: 'stream'
    };

    try {
        const response = await caseworkService.get(`/case/${caseId}/document/${documentId}/pdf`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PDF_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PDF_FAILURE', { ...req.params });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
        return next(new DocumentError('Unable to retrieve PDF document'));
    }
}

async function getPdfDocumentPreview(req, res, next) {
    const logger = getLogger(req.requestId);
    const { caseId, documentId } = req.params;

    let options = {
        headers: User.createHeaders(req.user),
        responseType: 'stream'
    };

    logger.info('REQUEST_DOCUMENT_PREVIEW', { ...req.params });
    try {
        const response = await caseworkService.get(`/case/${caseId}/document/${documentId}/pdf`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_PREVIEW_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_PREVIEW_FAILURE', { ...req.params });
        if (error.response !== undefined && error.response.status === 401) {
            return next(new PermissionError('You are not authorised to work on this case'));
        }
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
            return { error: new PermissionError('You are not authorised to work on this case') };
        }
        logger.info('CASE_DOCUMENT_LIST_RETURN_EMPTY');
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