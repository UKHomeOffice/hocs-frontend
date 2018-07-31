const ErrorModel = require('../models/error');

const errorAjaxResponseMiddleware = (req, res, next) => {
    if (!res.noScript) {
        if (!res.error) {
            return res.status(200).send({ errors: req.form.errors });
        } else {
            return res.status(res.error.errorCode).send(res.error);
        }
    }
    next();
};
const errorMiddleware = (err, req, res, next) => {
    res.error = new ErrorModel({
        status: 500,
        title: 'Server Error',
        summary: err.message,
        stackTrace: err.stack
    }).toJson();
    next();
};

module.exports = {
    errorAjaxResponseMiddleware,
    errorMiddleware
};