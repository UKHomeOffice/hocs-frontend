import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {

    constructor(props) {
        super(props);
        const choices = Array.from(JSON.parse(JSON.stringify(props.choices)));
        choices.unshift({ label: '', value: '' });
        const conditionChoices = Array.from(JSON.parse(JSON.stringify(props.conditionChoices)));
        for (var i = 0; i < conditionChoices.length; i++) {
            const conditionChoice = Array.from(conditionChoices[i].choices);
            conditionChoice.unshift({ label: '', value: '' });
            conditionChoices[i].choices = conditionChoice;
        }

        const choicesToUse = Dropdown.getChoicesToUse(choices, conditionChoices, this.props);
        this.state = { value: this.props.value, choices, conditionChoices, choicesToUse };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.state.value) {
            this.props.updateState({ [this.props.name]: this.state.value });
        }
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    static getChoicesToUse(defaultChoices, conditionChoices, props) {
        var choicesToUse = defaultChoices;
        if (conditionChoices) {
            for (var i = 0; i < conditionChoices.length; i++) {
                const conditionPropertyValue = props.data[conditionChoices[i].conditionPropertyName];
                if (conditionPropertyValue && conditionChoices[i].conditionPropertyValue === conditionPropertyValue) {
                    choicesToUse = conditionChoices[i].choices.filter(choice => choice.active ?? true);
                    break;
                }
                choicesToUse = [];
            }
        }
        return choicesToUse;
    }

    static getDerivedStateFromProps(props, state) {
        const { choicesToUse } = state;
        const choices = Array.from(JSON.parse(JSON.stringify(props.choices)));
        choices.unshift({ label: '', value: '' });
        const conditionChoices = Array.from(JSON.parse(JSON.stringify(props.conditionChoices)));
        for (var i = 0; i < conditionChoices.length; i++) {
            const conditionChoice = Array.from(conditionChoices[i].choices);
            conditionChoice.unshift({ label: '', value: '' });
            conditionChoices[i].choices = conditionChoice;
        }
        const newChoicesToUse = Dropdown.getChoicesToUse(choices, conditionChoices, props);
        if (!Dropdown.choicesEqual(choicesToUse, newChoicesToUse)) {
            for (var j = 0; j < newChoicesToUse.length; j++) {
                if (newChoicesToUse[j].value === props.value) {
                    return {
                        choicesToUse: newChoicesToUse,
                        value: props.value
                    };
                }
            }
            return {
                choicesToUse: newChoicesToUse,
                value: ''
            };
        }
        if (props.value !== state.value) {
            return {
                value: props.value
            };
        }
        return null;
    }

    static choicesEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i].label !== b[i].label || a[i].value !== b[i].value) {
                return false;
            }
        }
        return true;
    }

    render() {
        const {
            disabled,
            error,
            hint,
            label,
            name,
            children
        } = this.props;
        const { choicesToUse } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                <select className={`govuk-select ${error ? 'govuk-select--error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    onChange={e => this.handleChange(e)}
                    value={this.state.value}
                >
                    {choicesToUse && choicesToUse.map((choice, i) => {
                        return (
                            <option key={i} value={choice.value} >{choice.label}</option>
                        );
                    })}
                </select>

                { children }
            </div>
        );
    }
}

Dropdown.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    conditionChoices: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    children: PropTypes.node
};

Dropdown.defaultProps = {
    disabled: false,
    choices: [],
    conditionChoices: [],
    data: []
};

export default Dropdown;
