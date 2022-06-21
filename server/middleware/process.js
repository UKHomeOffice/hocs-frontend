const { FormSubmissionError } = require('../models/error');
const showConditionFunctions = require('../../src/shared/helpers/show-condition-functions');
const hideConditionFunctions = require('../../src/shared/helpers/hide-condition-functions');

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
        const value = data[name];
        const [year = '', month = '', day = ''] = (value || '').split('-');

        if (year && month && day) {
            reducer[name] = `${sanitiseYearPart(year)}-${sanitiseDayMonthPart(month)}-${sanitiseDayMonthPart(day)}`;
        }
        else if (year + month + day === '') {
            reducer[name] = '';
        }
    },
    'checkbox': (reducer, field, data) => {
        const { name } = field.props;
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            reducer[name] = data[name];
        }
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

const byAcceptedFormData = (field) => {
    return field.component !== 'display' &&
        field.component !== 'somu-list';
};

function processMiddleware(req, res, next) {
    try {
        const data = req.body;

        const { schema } = req.form;

        req.form.data = schema.fields
            .filter(byAcceptedFormData)
            .filter(field => isFieldVisible(field.props, data))
            .reduce(createReducer(data, req), {});
    } catch (error) {
        return next(new FormSubmissionError('Unable to process form data'));
    }
    next();
}

function isFieldVisible({ visibilityConditions, hideConditions }, data) {
    let isVisible = true;

    // show component based on visibilityConditions
    if (visibilityConditions) {
        isVisible = false;

        for (const condition of visibilityConditions) {
            if (condition.function && Object.prototype.hasOwnProperty.call(showConditionFunctions, condition.function)) {
                if (condition.conditionArgs) {
                    isVisible = showConditionFunctions[condition.function](data, condition.conditionArgs);
                } else {
                    isVisible = hideConditionFunctions[condition.function](data);
                }
            } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = true;
            }
        }
    }

    // hide component based on hideConditions
    if (hideConditions) {
        for (const condition of hideConditions) {
            if (condition.function && Object.prototype.hasOwnProperty.call(hideConditions, condition.function)) {
                if (condition.conditionPropertyName && condition.conditionPropertyValue) {
                    isVisible = hideConditionFunctions[condition.function](data, condition.conditionPropertyName, condition.conditionPropertyValue);
                } else {
                    isVisible = hideConditionFunctions[condition.function](data);
                }
            } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = false;
            }
        }
    }

    return isVisible;
}

/**
  * Dates that have leading zeros in a part are typically invalid and fail on a `new Date` or
  * Javas `LocalDate.parse`. Those dates that are obvious i.e. single digit 1-9 in the right
  * most character with any number of 0's before are clear so we can sanitise these and leave
  * only one zero pre-pended.
  *
  * We pad the resultant with the correct amount of 0's for the part of the date, as this allows
  * Java's `LocalDate.parse` to correctly parse the result.
  *
  * @param {String} value the date part to sanitise
  * @param {Number} paddingZeros the amount of zero's that should be leading, defaults to 2
  * @returns the sanitised date part.
  */
function sanitiseDayMonthPart(value, paddingZeros = 2) {
    if (value === '') {
        return value;
    }

    const regexMatch = new RegExp('^0+[1-9]$');

    if (regexMatch.test(value)) {
        return value.substring(value.length - 2);
    }
    return value.padStart(paddingZeros, '0');
}

/**
 * Dates that have a year part that contains leading zeroes are currentyly saved to the system
 * with these leading zeroes. These zeroes add nothing to a year and can be safely stripped
 * without the year losing it's meaning.
 *
 * @param {String} value the date year to sanitise
 * @returns the sanitised date year part.
 */
function sanitiseYearPart(value) {
    if (value === '') {
        return value;
    }

    return value.replace(/^0+/, '');
}

module.exports = {
    processMiddleware
};
