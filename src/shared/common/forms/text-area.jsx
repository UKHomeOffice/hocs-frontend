import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextArea extends Component {

    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    _onChange(e) {
        let value = e.target.value.slice(0, this.props.limit);
        this.setState({ value: value });
        this.props.updateState({ [this.props.name]: value });
    }

    render() {
        const {
            disabled,
            error,
            hint,
            label,
            name,
            rows
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>


                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}


                <textarea className={`govuk-textarea form-control-3-4 ${error ? 'govuk-textarea--error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    rows={rows}
                    onChange={e => this._onChange(e)}
                    value={this.state.value}
                    defaultValue={this.state.value}
                />
                {!disabled &&
                <div id="with-hint-info" className="govuk-hint govuk-character-count__message" aria-live="polite">
                    You have {this.calculateRemaining()} characters remaining
                </div>
                }
            </div>
        );
    }

    calculateRemaining() {
        return this.props.limit - this.state.value.replaceAll('\r\n', '\n').length;
    }
}

TextArea.propTypes = {
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    rows: PropTypes.number,
    limit: PropTypes.number,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

TextArea.defaultProps = {
    disabled: false,
    rows: 5,
    type: 'text',
    limit: 4000,
    value: ''
};

export default TextArea;
