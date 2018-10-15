import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
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

                <fieldset id={name} className={`govuk-fieldset ${className ?  className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <span className="govuk-hint">{hint}</span>}
                    {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                    <div className={'govuk-radios'}>
                        {choices && choices.map((choice, i) => {
                            return (
                                <div key={i} className="govuk-radios__item">
                                    <input id={`${name}-${choice.value}`}
                                        type={type}
                                        name={name}
                                        value={choice.value}
                                        checked={(this.state.value === choice.value)}
                                        onChange={e => this.handleChange(e)}
                                        className={'govuk-radios__input'}
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
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

Radio.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
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
    disabled: false,
    type: 'radio'
};

export default Radio;