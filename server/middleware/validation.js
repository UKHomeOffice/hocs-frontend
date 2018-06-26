const logger = require('../libs/logger');
const forms = require('../forms/index');

const validationErrors = {
    required: 'is required',
    tooBig: 'is too big',
    tooBigMany: 'is too many big files at once',
    uploadDisabled: 'uploads are disabled'
};

const validators = {
    required: (value) => {
        if (value !== null && value !== '') {
            return null;
        } else {
            return validationErrors.required;
        }
    },
    isSensibleSize: (files) => {
        if (!process.env.MAX_UPLOAD_SIZE) return validationErrors.uploadDisabled;

        let allowableBatchSize = process.env.MAX_UPLOAD_SIZE_BATCH ? process.env.MAX_UPLOAD_SIZE_BATCH : Infinity;
        const maxSingleSize = process.env.MAX_UPLOAD_SIZE;

        for (let file of files) {
            if (file.size > maxSingleSize) return validationErrors.tooBig;
            allowableBatchSize -= file.size;
            if (allowableBatchSize < 0) {
                // user uploading too many big files at once
                return validationErrors.tooBigMany;
            }
        }
        return null;
    }
};

const validation = (req, res, next) => {
        logger.info('VALIDATION MIDDLEWARE');
        logger.debug(JSON.stringify(Object.keys(req.form.data)));
        const {data, schema} = req.form;
        req.form.errors = schema.fields.reduce((result, field) => {
            const {validation, props: {name}} = field;
            const value = data[name];
            if (validation) {
                validation.map(validator => {
                    try {
                        const validationError = validators[validator].call(this, value);
                        if (validationError) {
                            result[field.props.name] = `${field.props.label} ${validationError}`;
                        }
                    } catch(e) {
                        logger.warn(`Unsupported validator passed (${validator}) in form`);
                    }

                });
            }
            return result;
        }, {});
        logger.debug(`Validation errors: ${JSON.stringify(req.form.errors)}`);
        next();
};

module.exports = validation;