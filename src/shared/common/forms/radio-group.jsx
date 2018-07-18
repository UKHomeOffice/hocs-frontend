import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {

    constructor(props) {
        super(props);
        const fallbackValue = this.props.choices[0] ? this.props.choices[0].value : null;
        const value = this.props.value || fallbackValue;
        this.state = { value };
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

                <fieldset className={`govuk-fieldset ${className ?  className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-!-font-weight-bold">{label}</span>
                    </legend>

                    {hint && <span className="govuk-form-hint">{hint}</span>}
                    {error && <span className="govuk-error-message">{error}</span>}

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

                        {choices.length === 0 && <Fragment>No options available</Fragment>}
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