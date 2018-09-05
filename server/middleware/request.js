const logger = require('../libs/logger');
const { ValidationError } = require('../models/error');

/* eslint-disable-next-line  no-unused-vars*/
function apiErrorMiddleware(err, req, res, next) {

    if (err instanceof ValidationError) {
        logger.debug(err.message);
        return res.status(err.status).json({ errors: err.fields });
    } else {
        logger.error(err.message);
        return res.status(err.status || 500).json({
            message: err.message,
            status: err.status,
            stack: err.stack,
            title: err.title
        });
    }
}

function errorMiddleware(err, req, res, next) {
    if (err instanceof ValidationError) {
        logger.debug(err.message);
        req.form.errors = err.fields;
    } else {
        logger.error(err.message);
        res.locals.error = {
            message: err.message,
            status: err.status,
            stack: err.stack,
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