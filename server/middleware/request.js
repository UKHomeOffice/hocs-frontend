const logger = require('../libs/logger');
const { GenericError, ValidationError } = require('../models/error');
const { isProduction } = require('../config');
const { v4: uuid } = require('uuid');
const listService = require('../services/list/');

function axiosErrorMiddleware(err, _req, _res, next) {
    if (err.isAxiosError) {
        if (err.response) {
            return next(new GenericError(err.response.data, err.response.status));
        } else if (err.request) {
            return next(new GenericError(`Failed to request following endpoint ${err.config.url} for reason ${err.code}`, 500));
        }
        return next(new GenericError(`Axios failed to process the request for reason ${err.code}`, 500));
    }
    return next(err);
}

function apiErrorMiddleware(err, req, res, _) {
    if (err instanceof ValidationError) {
        logger(req.requestId).info('VALIDATION_FAILED', { errors: Object.keys(err.fields) });
        return res.status(err.status).json({ errors: err.fields });
    } else {
        logger(req.requestId).error('ERROR', { message: err.message, stack: err.stack });
        return res.status(err.status || 500).json({
            message: err.message,
            status: err.status || 500,
            stack: isProduction ? null : err.stack,
            title: err.title
        });
    }
}

function errorMiddleware(err, req, res, next) {
    if (err instanceof ValidationError) {
        logger(req.requestId).info('VALIDATION_FAILED', { errors: Object.keys(err.fields) });
        res.status(err.status || 500);
        req.form.errors = err.fields;
    } else {
        logger(req.requestId).error('ERROR', { message: err.message, stack: err.stack });
        res.locals.error = {
            message: err.message,
            status: err.status || 500,
            stack: isProduction ? null : err.stack,
            title: err.title
        };
    }
    return next();
}

function initRequest(req, res, next) {
    const requestId = uuid();
    res.locals = {};
    req.requestId = requestId;
    req.listService = listService.getInstance(requestId, req.user);
    logger(requestId).info('REQUEST_RECEIVED', { method: req.method, endpoint: req.originalUrl });
    return next();
}

module.exports = {
    axiosErrorMiddleware,
    apiErrorMiddleware,
    errorMiddleware,
    initRequest
};
