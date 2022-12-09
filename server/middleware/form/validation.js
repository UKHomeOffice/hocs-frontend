const { FormSubmissionError, ValidationError } = require('../../models/error');
const { DOCUMENT_WHITELIST, DOCUMENT_BULK_LIMIT, VALID_DAYS_RANGE } = require('../../config').forContext('server');
const { MIN_ALLOWABLE_YEAR, MAX_ALLOWABLE_YEAR } = require('../../libs/dateHelpers');
const getLogger = require('../../libs/logger');
const { isFieldComponentOfType } = require('./fieldHelper');

const validationErrors = {
    required: label => `${label} is required`,
    alphanumeric: label => `${label} must be alphanumeric`,
    strictCurrency: label => `${label} must be a currency amount to 2 decimal places`,
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
    approvalsFulfilled: () => 'The required approvals to progress the case have not been received.',
    oneOf: () => 'Select at least one option',
    isValidMonth: label => `${label} must contain a real month`,
    isBeforeMaxYear: label => `${label} must be before ${MAX_ALLOWABLE_YEAR}`,
    isAfterMinYear: label => `${label} must be after ${MIN_ALLOWABLE_YEAR}`,
    isValidDay: label => `${label} must contain a real day`,
    isValidWithinGivenDays: (label, days) => `${label} must be within the next ${days} days.`,
    isValidWithinPastGivenDays: (label, days) => `${label} must be within the last ${days} days.`,
};

const approvalsReducer = ({ approved, rejected, cancelled, outstanding }, value) => {

    if (!value.data || !value.data.approvalRequestCreatedDate) {
        throw new Error('Value passed for validation is not a valid Approval Request object.');
    }

    if (value.data && !value.data.approvalRequestStatus) {
        outstanding++;
    }

    if (value.data &&
        value.data.approvalRequestStatus &&
        value.data.approvalRequestStatus === 'approvalRequestCancelled'
    ) {

        cancelled++;
    }

    if (value.data &&
        value.data.approvalRequestStatus &&
        value.data.approvalRequestStatus === 'approvalRequestResponseReceived' &&
        value.data.approvalRequestDecision &&
        value.data.approvalRequestDecision === 'approved'
    ) {
        approved++;
    }

    if (value.data &&
        value.data.approvalRequestStatus &&
        value.data.approvalRequestStatus === 'approvalRequestResponseReceived' &&
        value.data.approvalRequestDecision &&
        value.data.approvalRequestDecision === 'rejected'
    ) {
        rejected++;
    }

    return { approved, rejected, cancelled, outstanding };
};

const approvalRequestsFulfilled = (value, message, defaultError) => {
    const logger = getLogger();
    const validationErrorMsg = (message || defaultError);

    let approvals = null;
    try {
        approvals = JSON.parse(value);
    } catch (error) {
        logger.error('APPROVAL_REQUEST_FULFILLMENT_VALIDATION_ERROR', { message: error.message, stack: error.stack  });
        throw new Error('Value passed for validation is not a valid Approval Request object.');
    }

    if (!Array.isArray(approvals)) {
        throw new Error('Value passed for validation is not a valid Approval Request object.');
    }

    const reducedApprovalStats = approvals.reduce(approvalsReducer, { approved: 0, rejected: 0, cancelled: 0, outstanding: 0 });
    if (reducedApprovalStats.rejected > 0 || reducedApprovalStats.outstanding > 0 || reducedApprovalStats.approved < 1) {
        return validationErrorMsg;
    }

    return null;
};

const requestsFulfilled = ( value, message, statusField, cancelledValue, completeValue, defaultError ) => {
    const logger = getLogger();

    let valid = false;
    try {
        const contributions = value ? JSON.parse(value) : undefined;

        if (Array.isArray(contributions)) {
            const result = contributions.filter(contribution => {
                const contributionStatus = contribution.data[statusField];
                return (!(contributionStatus === cancelledValue || contributionStatus === completeValue));
            });

            if (result.length === 0) {
                valid = true;
            }
        }
    } catch (error) {
        logger.error('REQUEST_FULFILLED_VALIDATION_ERROR', { message: error.message, stack: error.stack  });
    }

    return valid ? null : (message || defaultError);
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
    requiredIfValueSet: ({ label, value, message, props, data }) => {
        if(data[props.conditionPropertyName] !== props.conditionPropertyValue) {
            return null;
        }

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
    strictCurrency: ({ label, value, message }) => {
        const format = /^\d+(\.\d{2})$/;
        if (value && !format.test(value)) {
            return message || validationErrors.strictCurrency(label);
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
        return requestsFulfilled( value,
            message,
            'contributionStatus',
            'contributionCancelled',
            'contributionReceived',
            validationErrors.contributionsFulfilled());
    },
    approvalsFulfilled: ({ value, message }) => {
        return approvalRequestsFulfilled( value,
            message,
            validationErrors.approvalsFulfilled());
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
    },
    isValidWithinGivenDays({ label, value, message, props: { days } }) {
        let limitDate = new Date();
        limitDate.setDate(limitDate.getDate() + parseInt(days));
        if (new Date(value).valueOf() >= limitDate.valueOf()) {
            return message || validationErrors.isValidWithinGivenDays(label, days);
        }
        return null;
    },
    isValidWithinPastGivenDays({ label, value, message, props: { days } }) {
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - parseInt(days));
        if (new Date(value).valueOf() <= limitDate.valueOf()) {
            return message || validationErrors.isValidWithinPastGivenDays(label, days);
        }
        return null;
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
    let validationError;
    const conditionalRadioButtonTextFieldId = `${data[name]}Text`;
    if (conditionalRadioButtonTextFieldId in data) {
        const radioChoice = choices.find(choice => {
            return choice.value === data[name];
        });
        if(radioChoice.conditionalContent){
            let label = radioChoice.conditionalContent.label;
            const value = data[conditionalRadioButtonTextFieldId];

            validationError = validators[validator].call(
                this,
                { label, value }
            );
        }
        if (validationError) {
            result[conditionalRadioButtonTextFieldId] = validationError;
        }
    }
}

function validateConditionalAfterRadioContentIfExists(data, name, choices, validator, result) {
    let validationError = true;
    if (Array.isArray(choices)){
        const radioChoice = choices.find(choice => {
            return choice.value === data[name];
        });
        if (radioChoice && radioChoice.conditionalContentAfter){
            radioChoice.conditionalContentAfter.forEach(element => {
                if (element.validation){
                    const value = data[element.name];
                    const label = element.label;
                    validationError = validators[element.validation.type].call(
                        this,
                        { label, value }
                    );
                    if (validationError) {
                        result[label] = validationError;
                    }
                }
            });
        }
    }
}

const validateForm = (schema, data = {}) => {
    if (!schema) {
        throw new FormSubmissionError('No form provided.');
    }

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
        .filter(field => !isFieldComponentOfType(field, 'display'))
        .reduce((result, field) => {
            validateField(field, data, result, validationSuppressor);
            return result;
        }, {});


    let formValidationErrors = {};

    // Add form validation here
    if (schema.validation) {
        schema.validation.map(validationSchema => {
            if (Object.keys(validationSchema).length > 0) {
                formValidationErrors = { ...formValidationErrors, ...validateForm(data, validationSchema) };
            }
        });
    }

    const validationErrors = { ...fieldValidationErrors, ...formValidationErrors };

    if (Object.keys(validationErrors).length > 0) {
        throw new ValidationError('Form validation failed', validationErrors);
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
            props: { name, label, sections, items, choices }
        } = field;

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
                                validateConditionalAfterRadioContentIfExists.call(
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
                        const { type, message, props } = validator;
                        if (Object.prototype.hasOwnProperty.call(validators, type)) {
                            const validationError = validators[type].call(this, { label, value, message, props, data });

                            if (component === 'radio') {
                                validateConditionalRadioContentIfExists.call(
                                    this,
                                    data,
                                    name,
                                    choices,
                                    'required',
                                    result
                                );
                                validateConditionalAfterRadioContentIfExists.call(
                                    this,
                                    data,
                                    name,
                                    choices,
                                    validator,
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
};

module.exports = {
    validateForm,
    validators
};
