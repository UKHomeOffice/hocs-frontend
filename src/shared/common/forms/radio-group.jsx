import React, {Component, Fragment} from "react";

class Radio extends Component {

    constructor(props) {
        super(props);
        const fallbackValue = this.props.choices[0] ? this.props.choices[0].value : null;
        const value = this.props.value || fallbackValue;
        this.state = {value}
    }

    componentDidMount() {
        this.props.updateState({[this.props.name]: this.state.value});
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        this.props.updateState({[this.props.name]: e.target.value});
    }

    render() {
        const {
            label,
            hint,
            name,
            error,
            disabled,
            choices,
            type,
            className
        } = this.props;
        return (
            <div className={`form-group${error ? ' form-group-error' : ''}`}>

                <fieldset className={className} disabled={disabled}>

                    <legend id={`${name}-legend`}>
                        <span className="form-label-bold">{label}</span>
                        {hint && <span className="form-hint">{hint}</span>}
                        {error && <span className="error-message">{error}</span>}
                    </legend>

                    {choices && choices.map((choice, i) => {
                        return (
                            <div key={i} className="multiple-choice">
                                <input id={`${name}-${choice.value}`}
                                       type={type}
                                       name={name}
                                       value={choice.value}
                                       checked={(this.state.value === choice.value) || choice.checked}
                                       onChange={e => this.handleChange(e)}
                                />
                                <label htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
                            </div>
                        );
                    })}
                    {choices.length === 0 && <Fragment>No options available</Fragment>}

                </fieldset>

            </div>
        )
    }
}

Radio.defaultProps = {
    type: 'radio',
    choices: [],
    disabled: false
};

export default Radio;