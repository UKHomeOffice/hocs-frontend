const {default: forms} = require('../../build/server/forms.server');

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
        console.log('VALIDATION MIDDLEWARE');
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
                    console.warn(`WARNING: Unsupported validator passed - ${validator}`);
                }

            });
            return result;
        }, {});
        next();
};

module.exports = validation;