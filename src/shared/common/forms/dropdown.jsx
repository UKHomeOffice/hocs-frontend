import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {

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
        e.preventDefault();
    }

    render() {
        const {
            choices,
            disabled,
            error,
            hint,
            label,
            name
        } = this.props;
        return (
            <div className={`form-group${error ? ' form-group-error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`}>

                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}

                </label>

                <select className={`form-control ${error ? 'form-control-error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}
                >
                    {choices && choices.map((choice, i) => {
                        return (
                            <option key={i} value={choice.value}>{choice.label}</option>
                        );
                    })}
                </select>
            </div>
        );
    }
}

Dropdown.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Dropdown.defaultProps = {
    value: '',
    disabled: false,
    choices: []
};

export default Dropdown;