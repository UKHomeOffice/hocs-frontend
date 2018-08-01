const logger = require('../libs/logger');
const ErrorModel = require('../models/error');

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
            reducer[`${name}-${choice.value}`] = selected.includes(choice.value);
        });
    },
    'add-document': (reducer, field, data, req) => {
        const { name } = field.props;
        if (req.files && req.files.length === 0) {
            reducer[name] = null;
        } else {
            reducer[name] = req.files.filter(f => f.fieldname.startsWith(name));
            logger.debug(`Successfully attached ${reducer[name].length} documents to ${name}`);
        }
    },
};

function defaultAdapter(reducer, field, data) {
    const { name } = field.props;
    reducer[name] = data[name] || null;
}

const processMiddleware = (req, res, next) => {
    logger.debug('PROCESS MIDDLEWARE');
    res.noScript = req.query && req.query.noScript;
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
        req.error = new ErrorModel({
            status: 500,
            title: 'Server error',
            summary: 'Unable to process form data',
            stackTrace: error.stack
        });
    }
    next();
};

module.exports = {
    processMiddleware
};