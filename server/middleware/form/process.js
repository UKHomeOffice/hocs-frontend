const { FormSubmissionError, ValidationError } = require('../../models/error');

const { validateForm } = require('./validation');
const { isFieldComponentOfType } = require('./fieldHelper');
const showConditionFunctions = require('../../../src/shared/helpers/show-condition-functions');
const hideConditionFunctions = require('../../../src/shared/helpers/hide-condition-functions');

const customAdapters = {
    'radio': (reducer, field, data) => {
        const { name } = field.props;
        const conditionalRadioButtonTextFieldId = `${data[name]}Text`;

        if (Object.prototype.hasOwnProperty.call(data, name)) {
            reducer[name] = data[name];
            if (conditionalRadioButtonTextFieldId in data) {
                reducer[conditionalRadioButtonTextFieldId] = data[conditionalRadioButtonTextFieldId];
            }
        }
    },
    'date': (reducer, field, data) => {
        const { name } = field.props;
        const value = data[name] || '';
        const [year = '', month = '', day = ''] = value.split('-');

        if (year && month && day) {
            const sanitisedYear = `${sanitiseValueString(year, YEAR_REGEX)}`;
            const sanitisedMonth = `${sanitiseValueString(month, MONTH_REGEX, 2)}`;
            const sanitisedDay = `${sanitiseValueString(day, DAY_REGEX, 2)}`;

            if(sanitisedYear === '' || sanitisedMonth === '' ||  sanitisedDay === '') {
                reducer[name] = '';
            } else {
                reducer[name] = `${sanitisedYear}-${sanitisedMonth}-${sanitisedDay}`;
            }
        } else {
            reducer[name] = '';
        }
    },
    'checkbox': (reducer, field, data) => {
        const { name, choices = [] } = field.props;
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            reducer[name] = data[name];
        }
        choices.map(choice => {
            if (Object.prototype.hasOwnProperty.call(choice, 'name')) {
                if (Object.prototype.hasOwnProperty.call(data, choice.name)) {
                    reducer[choice.name] = data[choice.name];
                }
            }
        });
    },
    'add-document': (reducer, field, data, req) => {
        const { name } = field.props;
        if (req.files && req.files.length === 0) {
            reducer[name] = null;
        } else {
            reducer[name] = req.files.filter(f => f.fieldname.startsWith(name));
        }
    },
    'accordion': (reducer, field, data, req) => {
        if (field.props && field.props.sections) {
            field.props.sections.map(section => section.items
                .filter(field => field.type !== 'display')
                .reduce(createReducer(data, req), reducer));
        }
    },
    'expandable-checkbox': (reducer, { props: { name, items } = {} }, data, req) => {
        reducer[name] = data[name];
        if (items) {
            items
                .filter(field => field.type !== 'display')
                .reduce(createReducer(data, req), reducer);
        }
    },
};

function defaultAdapter(reducer, field, data) {
    const { name } = field.props;
    if (Object.prototype.hasOwnProperty.call(data, name)) {
        reducer[name] = data[name];
    }
}

const createReducer = (data, req) => (reducer, field) => {
    const component = field.component;

    if (Object.prototype.hasOwnProperty.call(customAdapters, component)) {
        customAdapters[component].call(this, reducer, field, data, req);
    } else {
        defaultAdapter(reducer, field, data);
    }
    return reducer;
};



/**
 * Check to see if the field has a component type that should not be sent in the form payload.
 * @param field the field to check
 * @returns {boolean} whether the field is of type that should not be sent.
 */
const isUnacceptedDataFields = (field) => {
    return isFieldComponentOfType(field, 'display') ||
        isFieldComponentOfType(field, 'somu-list');
};

function checkValidationCondition(validator, caseData) {
    if (Object.prototype.hasOwnProperty.call(validator, 'condition') && caseData[validator.condition.fieldName] !== validator.condition.value) {
        return false;
    }
    return true;
}

function getActiveValidators(validationSchemaJson, caseData) {
    let validationSchema;
    try {
        validationSchema = JSON.parse(validationSchemaJson);
    } catch (error) {
        validationSchema = validationSchemaJson;
    }
    if (!validationSchema) {
        return [];
    }
    const validationSchemaArray = Array.isArray(validationSchema) ? validationSchema : Array.of(validationSchema);

    return validationSchemaArray.filter(validator => checkValidationCondition(validator, caseData));
}

function processMiddleware(req, res, next) {
    try {
        const data = req.body;
        const { schema } = req.form;

        let visibleFields = schema.fields
            .reduce((fields, currField) => {
                fields.push(...reduceVisibleComponent(currField, data));
                return fields;
            }, [])
            .filter(Boolean);

        const fieldData = visibleFields.reduce(createReducer(data, req), {});
        const activeValidation = getActiveValidators(schema.validation, data);

        validateForm({ ...schema, fields: visibleFields, validation: activeValidation }, fieldData);

        req.form.data = visibleFields
            .filter(isUnacceptedDataFields)
            .reduce((strippedData, field) => stripUnacceptedFieldData(field.props, strippedData), fieldData);
    } catch (error) {
        if (error instanceof ValidationError) {
            return next(error);
        }
        return next(new FormSubmissionError('Unable to process form data'));
    }

    return next();
}

const reduceVisibleComponent = (field, data) => {
    const {
        component,
        props: { sections = [], items = [], visibilityConditions, hideConditions }
    } = field;

    if (component === 'accordion') {
        return sections.reduce((accordionFields, { items: sectionItems } = []) => {
            accordionFields.push(
                ...sectionItems.reduce((fields, item) => { return itemReducer(fields, item, data); }, []));
            return accordionFields;
        }, []);
    } else if (component === 'expandable-checkbox') {
        if (isFieldVisible(visibilityConditions, hideConditions, data)) {
            return items.reduce((fields, item) => { return itemReducer(fields, item, data); }, [field]);
        }
    } else {
        if (isFieldVisible(visibilityConditions, hideConditions, data)) {
            return [field];
        }
    }

    return [];
};

const itemReducer = (fields, item, data) => {
    fields.push(...reduceVisibleComponent(item, data));
    return fields;
};

const isFieldVisible = (visibilityConditions, hideConditions, data) => {
    let isVisible = true;

    // show component based on visibilityConditions
    if (visibilityConditions) {
        isVisible = false;

        for (const condition of visibilityConditions) {
            if (condition.function && Object.prototype.hasOwnProperty.call(showConditionFunctions, condition.function)) {
                if (condition.conditionArgs) {
                    isVisible = showConditionFunctions[condition.function](data, condition.conditionArgs);
                } else {
                    isVisible = showConditionFunctions[condition.function](data);
                }
            } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = true;
            }
        }
    }

    // hide component based on hideConditions
    if (hideConditions) {
        for (const condition of hideConditions) {
            if (condition.function && Object.prototype.hasOwnProperty.call(hideConditionFunctions, condition.function)) {
                if (condition.conditionPropertyName && condition.conditionPropertyValue) {
                    isVisible = hideConditionFunctions[condition.function](data, condition.conditionPropertyName, condition.conditionPropertyValue);
                } else if (condition.conditionArgs) {
                    isVisible = hideConditionFunctions[condition.function](data, condition.conditionArgs);
                } else {
                    isVisible = hideConditionFunctions[condition.function](data);
                }
            } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = false;
            }
        }
    }

    return isVisible;
};

const stripUnacceptedFieldData = ({ name }, data) => {
    delete data[name];
    return data;
};

const DAY_REGEX = /(?<!.)0*(?:[1-9]|[12]\d|3[01])(?!.)/;
const MONTH_REGEX = /(?<!.)0*(?:[1-9]|1[0-2])(?!.)/;
const YEAR_REGEX = /(?<!.)0*[1-9]\d{3}(?!.)/;

function sanitiseValueString(value, pattern, padLength = 0) {
    if (value === '') {
        return value;
    }

    const regexMatcher = new RegExp(pattern);
    const regexMatch = regexMatcher.exec(value);

    if (regexMatch) {

        return regexMatch[0]
            .replace(/^0+/, '')
            .padStart(padLength, '0');
    }
    return '';
}

module.exports = {
    processMiddleware
};
