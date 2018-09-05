const logger = require('../libs/logger');

function errorAjaxResponseMiddleware(req, res, next) {
    if (!res.noScript) {
        if (!res.error) {
            return res.status(200).send({ errors: req.form.errors });
        } else {
            return res.status(res.error.errorCode).send(res.error);
        }
    }
    next();
}

/* eslint-disable-next-line  no-unused-vars*/
function apiErrorMiddleware(err, req, res, next) {
    logger.error(err);
    return res.status(err.status || 500).json({
        message: err.message,
        status: err.status,
        stack: err.stack,
        title: err.title
    });
}

function errorMiddleware(err, req, res, next) {
    logger.error(err);
    res.locals.error = {
        message: err.message,
        status: err.status,
        stack: err.stack,
        title: err.title
    };
    next();
}

function initRequest(req, res, next) {
    res.locals = {};
    next();
}

module.exports = {
    apiErrorMiddleware,
    errorAjaxResponseMiddleware,
    errorMiddleware,
    initRequest
};