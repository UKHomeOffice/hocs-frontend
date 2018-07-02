import React, {Component, Fragment} from "react";
import {ApplicationConsumer} from "../../../contexts/application.jsx";

class DocumentAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {value: this.props.value};
    }

    componentDidMount() {
        this.props.updateState({[this.props.name]: this.state.value});
    }

    handleChange(e) {
        e.preventDefault();
        Object.keys(e.target.files).map(file => this.props.updateState({[`${this.props.name}_${file}`]: e.target.files[file]}));
    }

    render() {
        const {
            label,
            hint,
            name,
            error,
            allowMultiple
        } = this.props;
        return (
            <Fragment>
                <label htmlFor={name} id={`${name}-label`}>

                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}

                </label>
                <input
                    className="button-file-upload"
                    type={'file'}
                    id={name}
                    name={name}
                    onChange={e => this.handleChange(e)}
                    multiple={allowMultiple}
                />
            </Fragment>
        )
    }
}

DocumentAdd.defaultProps = {
    label: 'Add document',
    disabled: false,
    allowMultiple: false
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({dispatch}) => <DocumentAdd {...props} dispatch={dispatch}/>}
    </ApplicationConsumer>
);

export default WrappedButton;