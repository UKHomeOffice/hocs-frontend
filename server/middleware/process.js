const forms = require('../forms/index');

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
    const data = req.body;
    req.form = {};
    req.form.data = forms.create.fields.reduce((processed, field) => {
        const {name} = field.props;
        const component = field.component;
        switch(component) {
            case 'date':
                processed[name] = processDate({
                    year: data[`${name}-year`],
                    month: data[`${name}-month`],
                    day: data[`${name}-day`]
                });
                break;
            case 'checkbox':
                processed = Object.assign({}, processed, processCheckbox(name, data[name], field.props.choices));
                break;
            default:
                processed[name] = data[name] || null;
        }
        return processed;
    }, {});
    next();
};

module.exports = process;