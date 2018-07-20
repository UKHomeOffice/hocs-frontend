const logger = require('../libs/logger');
const { DOCUMENT_WHITELIST } = require('../config').forContext('server');

const validationErrors = {
    required: 'is required',
    invalidFileExtension: (extension) => {
        if (extension) {
            return 'is a ' + extension.toUpperCase() + ' file which is not allowed';
        }
        return 'has a file extension that is not allowed';
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
    isBeforeToday (date) {
        if (new Date(date) >= new Date()) {
            return validationErrors.mustBeInPast;
        }
        return null;
    },
    isAfterToday (date) {
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
        if (files) {
            if (!DOCUMENT_WHITELIST) {
                logger.warn('No file extension whitelist found: not validating extensions');
                return null;
            }

            const allowableExtensions = DOCUMENT_WHITELIST.split(',');

            for (let file of files) {
                let fileExtension = file.originalname.split('.').slice(-1)[0];
                logger.debug('Validating extension: ' + fileExtension);

                if (!allowableExtensions.includes(fileExtension)) {
                    logger.debug('Rejecting extension: ' + fileExtension);
                    return validationErrors.invalidFileExtension(fileExtension);
                }

                logger.debug('Accepting extension: ' + fileExtension);
            }
            // no files to check:
            return null;
        }
    }
};

const validation = (req, res, next) => {
    logger.debug('VALIDATION MIDDLEWARE');
    const { data, schema } = req.form;
    const fields = schema.fields.filter(field => field.type !== 'display');
    req.form.errors = fields.reduce((result, field) => {
        const { validation, props: { name } } = field;
        const value = data[name];
        if (validation) {
            validation.map(validator => {
                try {
                    const validationError = validators[validator].call(this, value);
                    if (validationError) {
                        result[field.props.name] = `${field.props.label} ${validationError}`;
                    }
                } catch (e) {
                    logger.warn(`Error calling validator passed (${validator}) in form`);
                }

            });
        }
        return result;
    }, {});
    logger.debug(`Validation errors: ${JSON.stringify(req.form.errors)}`);
    next();
};

module.exports = {
    validator: validation,
    validators: validators
};