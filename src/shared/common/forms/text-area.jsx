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

    handleChange(e) {
        this.setState({ value: e.target.value });
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
            <div className={`form-group${error ? ' form-group-error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`}>

                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}

                </label>

                <textarea className={`form-control form-control-3-4 ${error ? 'form-control-error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    rows={rows}
                    onChange={e => this.handleChange(e)}
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
};

export default TextArea;