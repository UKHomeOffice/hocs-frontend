import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxGrid extends Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value.split(',').filter(cb => cb !== '') };
    }

    getChoices(props) {
        let choices = [];

        if (props.choices) {
            choices = props.choices;
        } else if(props.conditionChoices) {
            const conditionChoices = props.conditionChoices;
            for (var i = 0; i < conditionChoices.length; i++) {
                const conditionPropertyValue = props.data[conditionChoices[i].conditionPropertyName];
                if (conditionChoices[i].conditionPropertyValue === conditionPropertyValue) {
                    choices = conditionChoices[i].choices;
                    break;
                }
            }
        }

        return choices;
    }

    stateString() {
        var value = this.state.value.join();
        return value;
    }

    /**
     * Called when the component mounts, sets the output variable to the current state
     */
    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.stateString() });
    }

    /**
     * Handles a change in the component (a checkbox being ticked) and sets the output variable to the selected value
     *
     * @param {} e The event that caused this function to fire
     */
    handleChange(e) {
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

    render() {
        const {
            className,
            disabled,
            error,
            hint,
            label,
            name,
            showLabel,
            type,
            choicesPerRow
        } = this.props;

        const choices = this.getChoices(this.props);

        // This defines the overall style of the checkbox grid.
        const checkboxContainerStyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
        };

        // This defines the style of the individual checkboxes in the grid. The if statement here is to allow
        // for checbox grids without a specified checkbox width.
        const checkboxStyle = choicesPerRow ? {
            width: `${80/choicesPerRow}%`
        } : {
            width: `${80/3}%`
        };

        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
                <h2 className='govuk-heading-m'>
                    {label}
                </h2>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s" hidden={!showLabel}>{label}</span>
                    </legend>

                    {hint && <div className="govuk-hint">{hint}</div>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                    <div className={'govuk-checkboxes'} style={checkboxContainerStyle}>
                        {choices && choices.map((choice, i) => {
                            return (
                                <div key={i} className="govuk-checkboxes__item" style={checkboxStyle}>
                                    <input id={`${name}_${choice.value}`}
                                        type={type}
                                        name={name}
                                        value={choice.value}
                                        checked={
                                            this.state.value.includes(`${choice.value}`)
                                        }
                                        onChange={e => this.handleChange(e)}
                                        className={'govuk-checkboxes__input'}
                                    />
                                    <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}_${choice.value}`}>{choice.label}</label>
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

CheckboxGrid.propTypes = {
    choices: PropTypes.array,
    conditionChoices: PropTypes.array,
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
    choicesPerRow: PropTypes.string,
    data: PropTypes.object
};

CheckboxGrid.defaultProps = {
    disabled: false,
    type: 'checkbox',
    value: ''
};

export default CheckboxGrid;
