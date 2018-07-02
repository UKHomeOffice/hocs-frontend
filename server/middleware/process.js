const forms = require('../forms/index');
const logger = require('../libs/logger');

const processDate = ({year, month, day}) => {
    if (year && month && day) {
        return `${year}-${month}-${day}`;
    } else {
        return null;
    }
};

const processCheckbox = (name, value, choices) => {
    let selected = [];
    const processed = {};
    if (!Array.isArray(value)) {
        selected.push(value);
    } else {
        selected = value;
    }
    choices.map(choice => {
        processed[`${name}${choice.value}`] = selected.includes(choice.value);
    });
    return processed;
};

const process = (req, res, next) => {
    logger.info('PROCESS MIDDLEWARE');
    const data = req.body;
    // TODO: refactor, remove non functional elements from for schema for processing and validation
    req.form.schema.fields = req.form.schema.fields.filter(f => f.type !== 'display');
    logger.debug(JSON.stringify(req.originalUrl));
    logger.debug(JSON.stringify(req.body));
    logger.debug(`Number of files: ${req.files.length}`);
    req.form.data = req.form.schema.fields.reduce((reducer, field) => {
        const {name} = field.props;
        const component = field.component;
        switch(component) {
            case 'date':
                reducer[name] = processDate({
                    year: data[`${name}-year`],
                    month: data[`${name}-month`],
                    day: data[`${name}-day`]
                });
                break;
            case 'checkbox':
                reducer = Object.assign({}, reducer, processCheckbox(name, data[name], field.props.choices));
                break;
            case 'addDocument':
                if(req.files.length === 0) {
                    reducer[name] = null;
                } else {
                    reducer[name] = req.files.filter(f => f.fieldname.indexOf(name) === 0);
                }
                break;
            default:
                reducer[name] = data[name] || null;
        }
        return reducer;
    }, {});
    next();
};

module.exports = process;