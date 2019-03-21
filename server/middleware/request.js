const logger = require('../libs/logger.v2');
const events = require('../models/events');
const { ValidationError } = require('../models/error');
const { isProduction } = require('../config');
const uuid = require('uuid/v4');
const { fetchList } = require('../list/service');

/* eslint-disable-next-line  no-unused-vars*/
function apiErrorMiddleware(err, req, res, next) {

    if (err instanceof ValidationError) {
        logger().debug(err);
        return res.status(err.status).json({ errors: err.fields });
    } else {
        logger().error({ event_id: events.ERROR, message: err.message, stack: err.stack });
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
        logger().debug(err);
        res.status(err.status || 500);
        req.form.errors = err.fields;
    } else {
        logger().error({ event_id: events.ERROR, message: err.message, stack: err.stack });
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
    req.fetchList = fetchList(requestId, req.user);
    logger(requestId).info('REQUEST_RECEIVED', { method: req.method, endpoint: req.originalUrl });
    next();
}

module.exports = {
    apiErrorMiddleware,
    errorMiddleware,
    initRequest
};