const logger = require('../libs/logger');
const { FormSubmissionError } = require('../models/error');

const customAdapters = {
    'radio': (reducer, field, data) => {
        const { name } = field.props;
        const conditionalRadioButtonTextFieldId = `${data[name]}Text`;

        if (Object.prototype.hasOwnProperty.call(data, name)) {
            reducer[name] = data[name];
            if(conditionalRadioButtonTextFieldId in data) {
                reducer[conditionalRadioButtonTextFieldId] = data[conditionalRadioButtonTextFieldId];
            }
        }
    },
    'date': (reducer, field, data) => {
        const { name } = field.props;
        const value = data[name];
        const [year = '', month = '', day = ''] = (value || '').split('-');

        if (year && month && day) {
            reducer[name] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        else if (year + month + day === '') {
            reducer[name] = '';
        }
    },
    'checkbox': (reducer, field, data) => {
        const { name } = field.props;
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            const value = data[name];
            reducer[name] = value;
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

    if(Object.prototype.hasOwnProperty.call(customAdapters, component)) {
        customAdapters[component].call(this, reducer, field, data, req);
    } else {
        defaultAdapter(reducer, field, data);
    }
    return reducer;
};

function processMiddleware(req, res, next) {
    try {
        const data = req.body;
        const { schema } = req.form;
        req.form.data = schema.fields
            .filter(field => field.type !== 'display')
            .reduce(createReducer(data, req), {});
            processAdditionalContentAfter(req, data);
    } catch (error) {
        return next(new FormSubmissionError('Unable to process form data'));
    }
    next();
}

function getAdditionalContentAfter(req, data) {
    let fields = {};
    if (req.form.schema.fields){
        req.form.schema.fields.forEach(field => {
            if (Array.isArray(field.props.choices) && field.component === 'radio'){
                field.props.choices.forEach(choice => {
                    if (data[field.props.name] === choice.value){
                        if (choice.conditionalContentAfter){
                            choice.conditionalContentAfter.forEach(content => {
                                req.form.data[content.name] = data[content.name];
                            });
                        }
                    }
                });
            }
        });
    }
    return fields;
}

function processAdditionalContentAfter(req, data) {
    try {
        let content = getAdditionalContentAfter(req, data);
    } catch (error) {
        return next(new FormSubmissionError('Unable to process form data'));
    }
}

module.exports = {
    processMiddleware
};
