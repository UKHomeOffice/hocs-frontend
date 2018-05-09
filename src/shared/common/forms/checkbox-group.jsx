import React, {Component, Fragment} from "react";

class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.state = {value: new Set(this.props.value)};
    }


    componentDidMount() {
        this.props.updateState({[this.props.name]: Array.from(this.state.value)});
    }

    handleChange(e) {
        const selection = this.state.value;
        if(selection.has(e.target.value)) {
            selection.delete(e.target.value);
        } else {
            selection.add(e.target.value);
        }
        this.setState({value: selection});
        this.props.updateState({[this.props.name]: Array.from(this.state.value)});
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
        )
    }
}

Checkbox.defaultProps = {
    type: 'checkbox',
    choices: [],
    value: [],
    disabled: false
};

export default Checkbox;