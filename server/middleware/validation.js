const logger = require('../libs/logger');
const ErrorModel = require('../models/error');
const { DOCUMENT_WHITELIST } = require('../config').forContext('server');

const validationErrors = {
    required: 'is required',
    invalidFileExtension: (extension) => {
        return 'is a ' + extension.toUpperCase() + ' file which is not allowed';
    },
    nonsensicalDate: 'must be a date', // TODO: better error message
    mustBeInPast: 'must be a date in the past',
    mustBeInFuture: 'must be a date in the future'
};

const validators = {
    isValidDate: (date) => {
        if (isNaN(new Date(date).getDate())) {
            return validationErrors.nonsensicalDate;
        }
        return null;
    },
    isBeforeToday(date) {
        if (new Date(date) >= new Date()) {
            return validationErrors.mustBeInPast;
        }
        return null;
    },
    isAfterToday(date) {
        if (new Date(date) <= new Date()) {
            return validationErrors.mustBeInFuture;
        }
        return null;
    },
    required: (value) => {
        if (value !== null && value !== '') {
            return null;
        } else {
            return validationErrors.required;
        }
    },
    hasWhitelistedExtension: (files) => {
        if (files && files.length > 0) {
            const allowableExtensions = DOCUMENT_WHITELIST;
            for (let file of files) {
                let fileExtension = file.originalname.split('.').slice(-1)[0];
                logger.debug('Validating extension: ' + fileExtension);

                if (!allowableExtensions.includes(fileExtension)) {
                    logger.debug('Rejecting extension: ' + fileExtension);
                    return validationErrors.invalidFileExtension(fileExtension);
                }
                logger.debug('Accepting extension: ' + fileExtension);
            }
        }
        return null;
    }
};

const validationMiddleware = (req, res, next) => {
    logger.debug('VALIDATION MIDDLEWARE');
    if (req.form) {
        try {
            const { data, schema } = req.form;
            req.form.errors = schema.fields
                .filter(field => field.type !== 'display')
                .reduce((result, field) => {
                    const { validation, props: { name } } = field;
                    const value = data[name];
                    if (validation) {
                        validation.map(validator => {
                            if (validators.hasOwnProperty(validator)) {
                                const validationError = validators[validator].call(this, value);
                                if (validationError) {
                                    result[field.props.name] = `${field.props.label} ${validationError}`;
                                }
                            } else {
                                throw new Error('Validator does not exist');
                            }
                        });
                    }
                    return result;
                }, {});
            logger.debug(`Validation errors: ${JSON.stringify(req.form.errors)}`);
        } catch (error) {
            req.error = new ErrorModel({
                status: 500,
                title: 'Server error',
                summary: 'Unable to validate form data',
                stackTrace: error.stack
            }).toJson();
        }
    }
    next();
};

module.exports = {
    validationMiddleware,
    validators
};