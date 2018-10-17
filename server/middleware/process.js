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
        } else {
            reducer[name] = null;
        }
    },
    'checkbox': (reducer, field, data) => {
        const { name, choices } = field.props;
        let selected = [];
        const value = data[name];
        if (!Array.isArray(value)) {
            selected.push(value);
        } else {
            selected = value;
        }
        choices.map(choice => {
            reducer[`${name}_${choice.value}`] = selected.includes(choice.value);
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
};

function defaultAdapter(reducer, field, data) {
    const { name } = field.props;
    const result = data[name] === 'undefined' ? null : data[name];
    reducer[name] = result;
}

function processMiddleware(req, res, next) {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
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