const logger = require('../libs/logger');
const forms = require('../forms/index');

const validationErrors = {
    required: 'is required'
};

const validators = {
    required: (value) => {
        if (value !== null && value !== '') {
            return null;
        } else {
            return validationErrors.required;
        }
    }
};

const validation = (req, res, next) => {
        logger.info('VALIDATION MIDDLEWARE');
        const data = req.form.data;
        req.form.errors = forms.create.fields.reduce((result, field) => {
            const name = field.props.name;
            const value = data[name];
            field.validation.map(validator => {
                try {
                    const validationError = validators[validator].call(this, value);
                    if (validationError) {
                        result[field.props.name] = `${field.props.label} ${validationError}`;
                    }
                } catch(e) {
                    logger.warn(`Unsupported validator passed - ${validator}`);
                }

            });
            return result;
        }, {});
        next();
};

module.exports = validation;