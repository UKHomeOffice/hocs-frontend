import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {

    constructor(props) {
        super(props);
        const choices = Array.from(props.choices);
        const conditionChoices = Array.from(JSON.parse(JSON.stringify(props.conditionChoices)));
        for (var i = 0; i < conditionChoices.length; i++) {
            const conditionChoice = Array.from(conditionChoices[i].choices);
            conditionChoices[i].choices = conditionChoice;
        }

        const choicesToUse = Radio.getChoicesToUse(choices, conditionChoices, this.props);
        this.state = { value: this.props.value, choices, conditionChoices, choicesToUse };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.props.value });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.state.value) {
            this.props.updateState({ [this.props.name]: this.state.value });
        }
    }

    handleChange(e) {
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
        const newChoicesToUse = Radio.getChoicesToUse(choices, conditionChoices, props);
        if (choicesToUse !== newChoicesToUse) {
            for (var i = 0; i < newChoicesToUse.length; i++) {
                if (newChoicesToUse[i].value === props.value) {
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

    render() {
        const {
            className,
            disabled,
            error,
            hint,
            label,
            name,
            type,
            value
        } = this.props;
        const { choicesToUse } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <span className="govuk-hint">{hint}</span>}
                    {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                    <div className={'govuk-radios'}>
                        {choicesToUse && choicesToUse.map((choice, i) => {
                            return (
                                <div key={i} className="govuk-radios__item">
                                    <input id={`${name}-${choice.value}`}
                                        type={type}
                                        name={name}
                                        value={choice.value}
                                        checked={(value === choice.value)}
                                        onChange={e => this.handleChange(e)}
                                        className={'govuk-radios__input'}
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
                                </div>
                            );
                        })}

                        {choicesToUse.length === 0 && <p className="govuk-body">No options available</p>}
                    </div>
                </fieldset>
            </div>
        );
    }
}

Radio.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    conditionChoices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Radio.defaultProps = {
    choices: [],
    conditionChoices: [],
    data: null,
    disabled: false,
    type: 'radio'
};

export default Radio;