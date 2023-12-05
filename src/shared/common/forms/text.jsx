import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Text extends Component {

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.props.value });
    }

    _onChange(e) {
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    render() {
        const {
            className,
            disabled,
            elementClassName,
            labelClassName,
            error,
            hint,
            label,
            name,
            type,
            limit
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''} ${className ? className : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className={`govuk-label ${labelClassName ? labelClassName : 'govuk-label--s'}`}>{label}</label>
                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                <div>
                    <input className={classNames('govuk-input', 'errorFocus', { 'govuk-input--error': error }, elementClassName)}
                        id={name}
                        type={type}
                        name={name}
                        disabled={disabled}
                        maxLength={limit}
                        value={this.props.value}
                        onChange={e => this._onChange(e)}
                    />
                </div>
            </div >
        );
    }
}

Text.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    elementClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    limit: PropTypes.number,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Text.defaultProps = {
    disabled: false,
    type: 'text',
    limit: 4000,
    value: ''
};

export default Text;
