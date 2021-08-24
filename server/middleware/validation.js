const { FormSubmissionError, ValidationError } = require('../models/error');
const { DOCUMENT_WHITELIST, DOCUMENT_BULK_LIMIT, VALID_DAYS_RANGE } = require('../config').forContext('server');
const { MIN_ALLOWABLE_YEAR, MAX_ALLOWABLE_YEAR } = require('../libs/dateHelpers');
const showConditionFunctions = require('../../src/shared/helpers/show-condition-functions');

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
    oneOf: () => 'Select at least one option',
    isValidMonth: label => `${label} must contain a real month`,
    isBeforeMaxYear: label => `${label} must be before ${MAX_ALLOWABLE_YEAR}`,
    isAfterMinYear: label => `${label} must be after ${MIN_ALLOWABLE_YEAR}`,
    isValidDay: label => `${label} must contain a real day`,
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
    isValidDay({ label, value, message }) {
        if (value) {
            const day = getDay(value);
            if (day) {
                if (day > new Date(getYear(value), getMonth(value), 0).getDate()
                    || day < 1
                    || day.match('^(?:0+[1-3]|0{2,})\\d$')) {
                    return message || validationErrors.isValidDay(label);
                }
            }
        }
        return null;
    },
    isValidMonth({ label, value, message }) {
        if (value) {
            const month = getMonth(value);
            if (month) {
                if (month < 1
                    || month > 12
                    || month.match('^(?:0+1|0{2,})\\d$')) {
                    return message || validationErrors.isValidMonth(label);
                }
            }
        }
        return null;
    },
    isYearWithinRange({ label, value, message }) {
        if (value) {
            const year = getYear(value);
            if (year) {
                if (year > MAX_ALLOWABLE_YEAR) {
                    return message || validationErrors.isBeforeMaxYear(label);
                }
                else if (year < MIN_ALLOWABLE_YEAR) {
                    return message || validationErrors.isAfterMinYear(label);
                }
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
        const numberOfDaysInPast = VALID_DAYS_RANGE;
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
        const format = /^[a-z0-9]{2,5}\/[0-9]{7}\/[0-9]{2}$/i;
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
    },
    /**
     * oneOf used for form validation. Validator subschema should have array of strings of options to pick one of.
     */
    oneOf: ({ submittedFormData, options, message }) => {
        for (let element in options) {
            const validatorOption = options[element];
            if (submittedFormData[validatorOption]) {
                return null;
            }
        }
        return message || validationErrors.oneOf();
    }
};

const getDay = (date) => {
    return getDateSection(date, 2);
};

const getMonth = (date) => {
    return getDateSection(date, 1);
};

const getYear = (date) => {
    return getDateSection(date, 0);
};

const getDateSection = (date, section) => {
    const split = date.split('-');
    if (split.length >= section) {
        return split[section];
    }
    return undefined;
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

            const fieldValidationErrors = schema.fields
                .filter(field => field.type !== 'display')
                .reduce((result, field) => {
                    validateField(field, data, result, validationSuppressor);
                    return result;
                }, {});


            let formValidationErrors = {};

            // Add form validation here
            if (schema.validation) {
                const formValidationSchema = JSON.parse(schema.validation);

                if (Object.keys(formValidationSchema).length > 0) {
                    formValidationErrors = validateForm(data, formValidationSchema);
                }
            }

            const validationErrors = { ...fieldValidationErrors, ...formValidationErrors };


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
                if (condition.function && Object.prototype.hasOwnProperty.call(showConditionFunctions, condition.function)) {
                    if (condition.conditionPropertyName && condition.conditionPropertyValue) {
                        isVisible = showConditionFunctions[condition.function](data, condition.conditionPropertyName, condition.conditionPropertyValue);
                    }
                } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
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

    function runFormValidator(validation, data) {
        let message = '';
        if (validation.message) {
            message = validation.message;
        }

        const validationResult = formValidator(validation.validator).call(this,
            {
                submittedFormData: data,
                options: validation.options,
                message: message
            }
        );

        if (validationResult !== null) {
            if (validation.linkTo) {
                return {
                    [validation.linkTo]: validationResult
                };
            } else {
                // Ensure the error summary message links to a form element for usability
                throw new Error('Validator has no key to link to');
            }
        }

        return null;
    }

    function validateForm(data, validation) {
        let validationErrors = {};

        const result = runFormValidator(validation, data);

        if (result !== null) {
            Object.assign(validationErrors, result);
        }

        return validationErrors;
    }

    function formValidator(validatorName) {
        switch (validatorName) {
            case 'oneOf':
                return validators.oneOf;
            default:
                throw new Error(`Validator ${validatorName} does not exist`);
        }
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
                        if (Object.prototype.hasOwnProperty.call(validators, validator)) {

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
                        if (Object.prototype.hasOwnProperty.call(validators, type)) {
                            const validationError = validators[type].call(this, { label, value, message });
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
