const ErrorModel = require('../models/error');

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

function errorMiddleware(err, req, res, next) {
    res.error = new ErrorModel({
        status: 500,
        title: 'Server Error',
        summary: err.message,
        stackTrace: err.stack
    });
    next();
}

function initRequest(req, res, next) {
    res.locals = {};
    next();
}

module.exports = {
    errorAjaxResponseMiddleware,
    errorMiddleware,
    initRequest
};