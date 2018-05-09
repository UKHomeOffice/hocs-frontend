import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import ErrorSummary from "./error-summary.jsx";
import Text from "./text.jsx";
import Radio from "./radio-group.jsx";
import Date from "./date.jsx";
import Checkbox from "./checkbox-group.jsx";
import Submit from "./submit.jsx";
import TextArea from "./text-area.jsx";

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
                              error={this.props.errors && this.props.errors[field.props.name]}
                              updateState={data => this.updateFormState(data)}/>;
            case 'text':
                return <Text key={i}
                             {...field.props}
                             error={this.props.errors && this.props.errors[field.props.name]}
                             updateState={data => this.updateFormState(data)}/>;
            case 'date':
                return <Date key={i}
                             {...field.props}
                             error={this.props.errors && this.props.errors[field.props.name]}
                             updateState={data => this.updateFormState(data)}/>;
            case 'checkbox':
                return <Checkbox key={i}
                             {...field.props}
                             error={this.props.errors && this.props.errors[field.props.name]}
                             updateState={data => this.updateFormState(data)}/>;
            case 'text-area':
                return <TextArea key={i}
                             {...field.props}
                             error={this.props.errors && this.props.errors[field.props.name]}
                             updateState={data => this.updateFormState(data)}/>;
            case 'heading':
                return <h2 key={i} className="heading-medium">{field.props.label}</h2>;
        }
    }

    render() {
        const {errors, action, method, defaultActionLabel, children} = this.props;
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
                    {children}
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