import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {

    constructor(props) {
        super(props);
        if (this.props.saveSeparately) {

            let state = {};

            this.props.choices.map(choice => {
                state[choice.name] = this.props.data[choice.name] === choice.value ? choice.value : '';
            });

            this.state = state;
        } else {
            this.state = { value: this.props.value.split(',').filter(cb => cb !== '') };
        }
    }

    stateString() {
        var value = this.state.value.join();
        return value;
    }

    componentDidMount() {
        if (!this.props.saveSeparately) {
            this.props.updateState({ [this.props.name]: this.stateString() });
        }
    }

    handleChange(e) {
        if (this.props.saveSeparately) {
            const target = e.target;
            this.setState((currentState) => {
                if (currentState[target.name]) {
                    currentState[target.name] = '';
                } else {
                    currentState[target.name] = target.value;
                }
                return currentState;
            }, () => {
                this.props.updateState(this.state);
            });
        } else {
            const targetValue = e.target.value;
            this.setState((currentState) => {
                var selection = [];
                if (currentState.value.includes(targetValue)) {
                    selection = currentState.value.filter(cb => cb !== targetValue);
                } else {
                    selection = [...currentState.value, targetValue];
                }
                return { value: selection };
            }, () => {
                this.props.updateState({ [this.props.name]: this.stateString() });
            });
        }
    }

    render() {
        const {
            choices,
            className,
            disabled,
            error,
            hint,
            label,
            name,
            showLabel,
            saveSeparately,
            type
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s" hidden={!showLabel}>{label}</span>
                    </legend>

                    {hint && <div className="govuk-hint">{hint}</div>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                    <div className={'govuk-checkboxes govuk-checkboxes--small'}>
                        {choices && choices.map((choice, i) => {
                            return (
                                <div key={i} className="govuk-checkboxes__item">
                                    <input id={`${name}_${choice.value}_${i}`}
                                        type={type}
                                        name={saveSeparately ? choice.name : name}
                                        value={choice.value}
                                        checked={
                                            saveSeparately ? this.state[choice.name] !== '' : this.state.value.includes(`${choice.value}`)
                                        }
                                        onChange={e => this.handleChange(e)}
                                        className={'govuk-checkboxes__input ' + (i === 0 ? 'errorFocus' : '')}
                                    />
                                    <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}_${choice.value}_${i}`}>{choice.label}</label>
                                </div>
                            );
                        })}

                        {choices.length === 0 && <p className="govuk-body">No options available</p>}
                    </div>
                </fieldset>
            </div>
        );
    }
}

Checkbox.propTypes = {
    choices: PropTypes.array,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    showLabel: PropTypes.bool,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    saveSeparately: PropTypes.bool,
    data: PropTypes.object
};

Checkbox.defaultProps = {
    choices: [],
    disabled: false,
    type: 'checkbox',
    value: '',
    saveSeparately: false
};

export default Checkbox;
