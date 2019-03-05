const { FormSubmissionError } = require('../models/error');

const customAdapters = {
    'date': (reducer, field, data) => {
        const { name } = field.props;
        const date = {
            year: data[`${name}-year`],
            month: data[`${name}-month`],
            day: data[`${name}-day`],
        };
        if (date.year && date.month && date.day) {
            reducer[name] = `${date.year}-${date.month}-${date.day}`;
        }
    },
    'checkbox': (reducer, field, data) => {
        const { name } = field.props;
        if (Object.prototype.hasOwnProperty.call(data, name) && data[name] !== '') {
            let selected = [];
            const value = data[name];
            if (!Array.isArray(value)) {
                selected.push(value);
            } else {
                selected = value;
            }
            reducer[name] = selected;
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
};

function defaultAdapter(reducer, field, data) {
    const { name } = field.props;
    if (Object.prototype.hasOwnProperty.call(data, name) && data[name] !== '') {
        reducer[name] = data[name];
    }
}

function processMiddleware(req, res, next) {
    try {
        const data = req.body;
        const { schema } = req.form;
        req.form.data = schema.fields
            .filter(field => field.type !== 'display')
            .reduce((reducer, field) => {
                const component = field.component;
                if (customAdapters.hasOwnProperty(component)) {
                    customAdapters[component].call(this, reducer, field, data, req);
                } else {
                    defaultAdapter(reducer, field, data);
                }
                return reducer;
            }, {});
    } catch (error) {
        return next(new FormSubmissionError('Unable to process form data'));
    }
    next();
}

module.exports = {
    processMiddleware
};