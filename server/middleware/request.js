const logger = require('../libs/logger');
const { ValidationError } = require('../models/error');
const { isProduction } = require('../config');
const uuid = require('uuid/v4');
const listService = require('../services/list/');

/* eslint-disable-next-line  no-unused-vars*/
function apiErrorMiddleware(err, req, res, next) {

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
    next();
}

function initRequest(req, res, next) {
    const requestId = uuid();
    res.locals = {};
    req.requestId = requestId;
    req.listService = listService.getInstance(requestId, req.user);
    logger(requestId).info('REQUEST_RECEIVED', { method: req.method, endpoint: req.originalUrl });
    next();
}

module.exports = {
    apiErrorMiddleware,
    errorMiddleware,
    initRequest
};