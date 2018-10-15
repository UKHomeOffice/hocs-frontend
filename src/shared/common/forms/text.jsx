import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Text extends Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    _onChange(e) {
        this.setState({ value: e.target.value });
    }

    _onBlur(e) {
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    render() {
        const {
            disabled,
            error,
            hint,
            label,
            name,
            type
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                <input className={`govuk-input${error ? ' govuk-input--error' : ''}`}
                    id={name}
                    type={type}
                    name={name}
                    disabled={disabled}
                    value={this.state.value}
                    onChange={e => this._onChange(e)}
                    onBlur={e => this._onBlur(e)}
                />
            </div>
        );
    }
}

Text.propTypes = {
    disabled: PropTypes.bool,
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