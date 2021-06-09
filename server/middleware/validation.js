const { FormSubmissionError, ValidationError } = require('../models/error');
const { DOCUMENT_WHITELIST, DOCUMENT_BULK_LIMIT, VALID_DAYS_RANGE } = require('../config').forContext('server');

const validationErrors = {
    required: label => `${label} is required`,
    alphanumeric: label => `${label} must be alphanumeric`,
    currency: label => `${label} must be currency amount`,
    numeric: label => `${label} must be numeric`,
    hasWhitelistedExtension: (value, extension) => {
        return `${value} is a ${extension.toUpperCase()} file which is not allowed`;
    },
    fileLimit: () => `The number of files you have tried to upload exceeded the limit of ${DOCUMENT_BULK_LIMIT}`,
    isValidDate: label => `${label} must be a date`,
    isBeforeToday: label => `${label} must be a date in the past`,
    isAfterToday: label => `${label} must be a date in the future`,
    isValidWithinDate: label => `${label} must be within the last ${VALID_DAYS_RANGE} days`,
    validCaseReference: () => 'Case reference is not valid',
    contributionsFulfilled: () => 'Case contributions have to be completed or cancelled',
};

const validators = {
    isValidDate: ({ label, value, message }) => {
        if (value) {
            const date = new Date(value).getDate();
            if (isNaN(date) || date != value.split('-')[2]) {
                return message || validationErrors.isValidDate(label);
            }
        }
        return null;
    },
    isBeforeToday({ label, value, message }) {
        if (new Date(value).valueOf() >= new Date(Date.now()).valueOf()) {
            return message || validationErrors.isBeforeToday(label);
        }
        return null;
    },
    isAfterToday({ label, value, message }) {
        if (new Date(value).valueOf() <= new Date(Date.now()).valueOf()) {
            return message || validationErrors.isAfterToday(label);
        }
        return null;
    },
    isValidWithinDate({ label, value, message }) {
        const numberOfDaysInPast= VALID_DAYS_RANGE;
        let limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - numberOfDaysInPast);
        if (new Date(value).valueOf() <= limitDate.valueOf()) {
            return message || validationErrors.isValidWithinDate(label);
        }
        return null;
    },
    requiredArray: ({ label, value, message }) => {
        let valid = true;

        try {
            if (!value || JSON.parse(value).length === 0) {
                valid = false;
            }
        } catch (error) {
            // If the parsing of the value is false, then we know that the value is not an array
            valid = false;
        }

        return valid ? null : (message || validationErrors.required(label));
    },
    required: ({ label, value, message }) => {
        if (!value || value === '') {
            return (message || validationErrors.required(label));
        }
        return null;
    },
    alphanumeric: ({ label, value, message }) => {
        const format = /^[a-z0-9]+$/i;
        if (value && !format.test(value)) {
            return message || validationErrors.alphanumeric(label);
        }
        return null;
    },
    currency: ({ label, value, message }) => {
        const format = /^\d+(\.\d{2})?$/;
        if (value && !format.test(value)) {
            return message || validationErrors.currency(label);
        }
        return null;
    },
    numeric: ({ label, value, message }) => {
        const format = /^[0-9]+$/i;
        if (value && !format.test(value)) {
            return message || validationErrors.numeric(label);
        }
        return null;
    },
    hasWhitelistedExtension: ({ value, message }) => {
        if (value && value.length > 0) {
            const allowableExtensions = DOCUMENT_WHITELIST.map(extension => extension.toUpperCase());
            for (let file of value) {
                let fileExtension = file.originalname.split('.').slice(-1)[0];
                let fileName = file.originalname.split('.').slice(0)[0];

                if (!allowableExtensions.includes(fileExtension.toUpperCase())) {
                    return message || validationErrors.hasWhitelistedExtension(fileName, fileExtension);
                }
            }
        }
        return null;
    },
    fileLimit: ({ value, message }) => {
        if (value && value.length > DOCUMENT_BULK_LIMIT) {
            return message || validationErrors.fileLimit();
        }
        return null;
    },
    isValidCaseReference: ({ value, message }) => {
        const format = /^[a-z]{2,4}\/[0-9]{7}\/[0-9]{2}$/i;
        if (value && !format.test(value.trim())) {
            return message || validationErrors.validCaseReference();
        }
        return null;
    },
    contributionsFulfilled: ({ value, message }) => {
        let valid = true;
        try {
            const contributions = JSON.parse(value);

            if (Array.isArray(contributions)) {
                const result = contributions.filter(contribution => {
                    const contributionStatus = contribution.data.contributionStatus;
                    return (!(contributionStatus === 'contributionCancelled' || contributionStatus === 'contributionReceived'));
                });

                if (result.length !== 0) {
                    valid = false;
                }
            } else {
                valid = false;
            }
        } catch (error) {
            valid = false;
        }

        return valid ? null : (message || validationErrors.contributionsFulfilled());
    }
};

function validateConditionalRadioContentIfExists(data, name, choices, validator, result) {
    const conditionalRadioButtonTextFieldId = `${data[name]}Text`;

    if (conditionalRadioButtonTextFieldId in data) {
        const radioChoice = choices.find(choice => {
            return choice.value === data[name];
        });
        let label = radioChoice.conditionalContent.label;
        const value = data[conditionalRadioButtonTextFieldId];

        const validationError = validators[validator].call(
            this,
            { label, value }
        );
        if (validationError) {
            result[conditionalRadioButtonTextFieldId] = validationError;
        }
    }
}

function validationMiddleware(req, res, next) {
    if (req.form) {
        try {
            const { data, schema } = req.form;
            let validationSuppressor;
            if (schema.props && schema.props.validationSuppressors) {
                for (var i = 0; i < schema.props.validationSuppressors.length; i++) {
                    const suppressor = schema.props.validationSuppressors[i];
                    if (suppressor.fieldName === 'ALL' || data[suppressor.fieldName] === suppressor.value) {
                        validationSuppressor = suppressor;
                        break;
                    }
                }

            }

            const validationErrors = schema.fields
                .filter(field => field.type !== 'display')
                .reduce((result, field) => {
                    validateField(field, data, result, validationSuppressor);
                    return result;
                }, {});
            if (Object.keys(validationErrors).length > 0) {
                return next(new ValidationError('Form validation failed', validationErrors));
            }


        } catch (e) {
            return next(new FormSubmissionError('Unable to validate form data'));
        }
    }
    next();

    function isFieldVisible(visibilityConditions, hideConditions, data) {
        let isVisible = true;
        if (visibilityConditions) {
            isVisible = false;
            for (let condition of visibilityConditions) {
                if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                    isVisible = true;
                }
            }
        }

        if (hideConditions) {
            for (let condition of hideConditions) {
                if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                    isVisible = false;
                }
            }
        }
        return isVisible;
    }

    function validateField(field, data, result, validationSuppressor) {
        const {
            component,
            validation,
            props: { name, label, sections, items, visibilityConditions, hideConditions, choices }
        } = field;

        if (!isFieldVisible(visibilityConditions, hideConditions, data)) {
            return;
        }

        if (component === 'expandable-checkbox') {
            Array.isArray(items) && items.map(item => validateField(item, data, result, validationSuppressor));
        }

        if (component === 'accordion') {
            Array.isArray(sections) && sections.map(({ items }) => Array.isArray(items) && items.map(item => validateField(item, data, result, validationSuppressor)));
        } else {
            const value = data[name];
            // suppressing validation when supressors are:
            // 1. defined
            // 2.a Fields to exclude on supressor are not defined
            // 2.b Fields to exclude on supressor do not include current field we're about to validate
            let suppressValidation = false;
            if (validationSuppressor !== undefined) {
                suppressValidation = !Array.isArray(validationSuppressor.excludeFields) || !validationSuppressor.excludeFields.includes(name);
            }

            if (validation && !suppressValidation) {
                validation.map(validator => {
                    if (typeof validator === 'string') {
                        if(Object.prototype.hasOwnProperty.call(validators, validator)) {

                            if (component === 'radio') {
                                validateConditionalRadioContentIfExists.call(
                                    this,
                                    data,
                                    name,
                                    choices,
                                    validator,
                                    result
                                );
                            }

                            const validationError = validators[validator].call(this, { label, value });
                            if (validationError) {
                                result[field.props.name] = validationError;
                            }
                        }
                        else {
                            throw new Error(`Validator ${validator} does not exist`);
                        }
                    }
                    else {
                        const { type, message } = validator;
                        if(Object.prototype.hasOwnProperty.call(validators, type)) {
                            const validationError = validators[type].call(this, { label, value, message });

                            if (component === 'radio') {
                                validateConditionalRadioContentIfExists.call(
                                    this,
                                    data,
                                    name,
                                    choices,
                                    'required',
                                    result
                                );
                            }

                            if (validationError) {
                                result[field.props.name] = validationError;
                            }
                        }
                        else {
                            throw new Error(`Validator ${type} does not exist`);
                        }
                    }
                });
            }
        }
    }
}

module.exports = {
    validationMiddleware,
    validators
};
