import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.state = { value: new Set(this.props.value) };
    }


    componentDidMount() {
        this.props.updateState({ [this.props.name]: Array.from(this.state.value) });
    }

    handleChange(e) {
        const selection = this.state.value;
        if (selection.has(e.target.value)) {
            selection.delete(e.target.value);
        } else {
            selection.add(e.target.value);
        }
        this.setState({ value: selection });
        this.props.updateState({ [this.props.name]: Array.from(this.state.value) });
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
            type
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset className={`govuk-fieldset ${className ?  className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-!-font-weight-bold">{label}</span>
                    </legend>

                    {hint && <span className="govuk-form-hint">{hint}</span>}
                    {error && <span className="govuk-error-message">{error}</span>}

                    <div className={'govuk-checkboxes'}>
                        {choices.map((choice, i) => {
                            return (
                                <div key={i} className="govuk-checkboxes__item">
                                    <input id={`${name}-${choice.value}`}
                                        type={type}
                                        name={name}
                                        value={choice.value}
                                        checked={
                                            this.state[`${name}-${choice.value}`]
                                        }
                                        onChange={e => this.handleChange(e)}
                                        className={'govuk-checkboxes__input'}
                                    />
                                    <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
                                </div>
                            );
                        })}
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
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.array
};

Checkbox.defaultProps = {
    choices: [],
    disabled: false,
    type: 'checkbox',
    value: []
};

export default Checkbox;