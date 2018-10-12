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
            rows
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>


                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}


                <textarea className={`govuk-textarea form-control-3-4 ${error ? 'govuk-textarea--error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    rows={rows}
                    onChange={e => this._onChange(e)}
                    onBlur={e => this._onBlur(e)}
                    defaultValue={this.state.value}
                />
            </div>
        );
    }
}

TextArea.propTypes = {
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    rows: PropTypes.number,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

TextArea.defaultProps = {
    disabled: false,
    rows: 5,
    type: 'text',
    value: ''
};

export default TextArea;