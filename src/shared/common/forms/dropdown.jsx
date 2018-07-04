import React, {Component, Fragment} from "react";

class Dropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {value: this.props.value};
    }

    componentDidMount() {
        this.props.updateState({[this.props.name]: this.state.value});
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        this.props.updateState({[this.props.name]: e.target.value});
        e.preventDefault();
    }

    render() {
        const {
            label,
            hint,
            name,
            error,
            disabled,
            choices,
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
                    {choices && choices.map(choice => {
                        return (
                            <option value={choice.value}>{choice.label}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
}

Dropdown.defaultProps = {
    value: '',
    disabled: false
};

export default Dropdown;