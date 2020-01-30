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
            error,
            hint,
            label,
            name,
            type
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''} ${className ? className : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                <div>
                    <input className={classNames('govuk-input', { 'govuk-input--error': error }, elementClassName)}
                        id={name}
                        type={type}
                        name={name}
                        disabled={disabled}
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
    disabled: PropTypes.string,
    elementClassName: PropTypes.string,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Text.defaultProps = {
    disabled: false,
    label: 'TextArea field',
    type: 'text',
    value: ''
};

export default Text;