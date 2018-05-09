import React, {Component, Fragment} from "react";

class TextArea extends Component {

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
    }

    render() {
        const {
            label,
            hint,
            name,
            error,
            disabled,
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
        )
    }
}

TextArea.defaultProps = {
    type: 'text',
    value: '',
    rows: 5,
    disabled: false
};

export default TextArea;