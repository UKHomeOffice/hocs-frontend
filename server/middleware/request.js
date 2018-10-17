const logger = require('../libs/logger');
const events = require('../models/events');
const { ValidationError } = require('../models/error');
const { isProduction } = require('../config');

/* eslint-disable-next-line  no-unused-vars*/
function apiErrorMiddleware(err, req, res, next) {

    if (err instanceof ValidationError) {
        logger.debug(err);
        return res.status(err.status).json({ errors: err.fields });
    } else {
        logger.error({ event: events.ERROR, message: err.message, stack: err.stack });
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
        logger.debug(err);
        res.status(err.status || 500);
        req.form.errors = err.fields;
    } else {
        logger.error({ event: events.ERROR, message: err.message, stack: err.stack });
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
    res.locals = {};
    next();
}

module.exports = {
    apiErrorMiddleware,
    errorMiddleware,
    initRequest
};