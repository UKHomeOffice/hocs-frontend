const logger = require('../libs/logger');
const forms = require('../forms/index');
const {DOCUMENT_WHITELIST} = require('../config').forContext('server');

const validationErrors = {
    required: 'is required',
    invalidFileExtension: (extension) => {
        if (extension) {
            return 'is a ' + extension.toUpperCase() + ' file which is not allowed';
        }
        return 'has a file extension that is not allowed';
    }
};

const validators = {
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
                if (allowableExtensions.includes(fileExtension)) {
                    logger.debug('Accepting extension: ' + fileExtension);
                    return null;
                }

                logger.debug('Rejecting extension: ' + fileExtension);
                return validationErrors.invalidFileExtension(fileExtension);
            }
            // no files to check:
            return null;
        }
    }
};

const validation = (req, res, next) => {
        logger.debug('VALIDATION MIDDLEWARE');
        const {data, schema} = req.form;
        const fields = schema.fields.filter(field => field.type !== 'display');
        req.form.errors = fields.reduce((result, field) => {
            const {validation, props: {name}} = field;
            const value = data[name];
            if (validation && validation.length > 0) {
                validation.map(validator => {
                    try {
                        const validationError = validators[validator].call(this, value);
                        if (validationError) {
                            result[field.props.name] = `${field.props.label} ${validationError}`;
                        }
                    } catch(e) {
                        logger.warn(`Validator (${validator}): ${e.stack}`);
                    }

                });
            }
            return result;
        }, {});
        logger.debug(`Validation errors: ${JSON.stringify(req.form.errors)}`);
        next();
};

module.exports = validation;