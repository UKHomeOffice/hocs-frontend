import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {

    constructor(props) {
        super(props);
        const choices = Array.from(props.choices);
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

    componentDidUpdate() {
        this.props.updateState({ [this.props.name]: this.state.value });
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
                if (conditionChoices[i].conditionPropertyValue === conditionPropertyValue) {
                    choicesToUse = conditionChoices[i].choices;
                    break;
                }
            }
        }
        return choicesToUse;
    }

    static getDerivedStateFromProps(props, state) {
        const { choicesToUse, choices, conditionChoices } = state;
        const newChoicesToUse = Dropdown.getChoicesToUse(choices, conditionChoices, props);
        if (choicesToUse !== newChoicesToUse) {
            return {
                choicesToUse: newChoicesToUse,
                value: ''
            };
        }
        return null;
    }

    render() {
        const {
            disabled,
            error,
            hint,
            label,
            name
        } = this.props;
        const { choicesToUse } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

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
    value: PropTypes.string
};

Dropdown.defaultProps = {
    disabled: false,
    choices: [],
    conditionChoices: [],
    data: []
};

export default Dropdown;