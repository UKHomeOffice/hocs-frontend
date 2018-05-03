import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import ErrorSummary from "./error-summary.jsx";
import Text from "./text.jsx";
import Radio from "./radio.jsx";
import Submit from "./submit.jsx";

class Form extends Component {

    constructor() {
        super();
        this.state = {};
    }

    updateFormState(data) {
        this.setState(data);
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post(this.props.action, {...this.state})
            .then(res => {
                this.setState({redirect: res.data.redirect});
            })
            .catch(err => {
                console.error(err);
                this.setState({redirect: '/error'});
            });
    };

    renderFormComponent(field, i) {
        switch (field.component) {
            case 'radio':
                return <Radio key={i}
                              {...field.props}
                              error={this.props.errors && this.props.errors[field.name]}
                              updateState={data => this.updateFormState(data)}/>;
            case 'text':
                return <Text key={i}
                             {...field.props}
                             error={this.props.errors && this.props.errors[field.name]}
                             updateState={data => this.updateFormState(data)}/>;
            case 'heading':
                return <h2 key={i} className="heading-medium">{field.props.label}</h2>;
        }
    }

    render() {
        const {errors, action, method, defaultActionLabel} = this.props;
        return (
            <div>

                {errors && <ErrorSummary errors={errors}/>}

                <form
                    action={`${action}?noScript=true`}
                    method={method}
                    onSubmit={e => this.handleSubmit(e)}
                >

                    {this.props.fields.map((field, i) => {
                        return this.renderFormComponent(field, i);
                    })}
                    <Submit label={defaultActionLabel}/>

                </form>
                {this.state.redirect && <Redirect to={this.state.redirect} push/>}
            </div>

        )
    }
}

Form.defaultProps = {
    method: 'POST',
    fields: [],
    defaultActionLabel: 'Submit'
};

export default Form;