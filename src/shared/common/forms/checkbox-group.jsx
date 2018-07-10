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
            <div className={`form-group${error ? ' form-group-error' : ''}`}>

                <fieldset className={className} disabled={disabled}>

                    <legend id={`${name}-legend`}>
                        <span className="form-label-bold">{label}</span>
                        {hint && <span className="form-hint">{hint}</span>}
                        {error && <span className="error-message">{error}</span>}
                    </legend>

                    {choices.map((choice, i) => {
                        return (
                            <div key={i} className="multiple-choice">
                                <input id={`${name}-${choice.value}`}
                                    type={type}
                                    name={name}
                                    value={choice.value}
                                    checked={
                                        this.state[`${name}-${choice.value}`]
                                    }
                                    onChange={e => this.handleChange(e)}
                                />
                                <label htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
                            </div>
                        );
                    })}

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