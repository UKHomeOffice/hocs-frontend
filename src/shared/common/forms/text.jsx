import React, {Component, Fragment} from "react";

class Text extends Component {

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
            type
        } = this.props;
        return (
            <div className={`form-group${error ? ' form-group-error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`}>

                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}

                </label>

                <input className={`form-control ${error ? 'form-control-error' : ''}`}
                       id={name}
                       type={type}
                       name={name}
                       disabled={disabled}
                       value={this.state.value}
                       onChange={e => this.handleChange(e)}
                />
            </div>
        )
    }
}

Text.defaultProps = {
    type: 'text',
    value: '',
    disabled: false
};

export default Text;