import React, {Component, Fragment} from "react";
import axios from "axios";
import ErrorSummary from "./error-summary.jsx";
import Text from "./text.jsx";
import Radio from "./radio-group.jsx";
import Date from "./date.jsx";
import Checkbox from "./checkbox-group.jsx";
import Submit from "./submit.jsx";
import TextArea from "./text-area.jsx";
import AddDocument from "./composite/document-add.jsx";
import Button from "./button.jsx";
import {ApplicationConsumer} from "../../contexts/application.jsx";
import {redirect, updateForm, updateFormData, updateFormErrors} from "../../contexts/actions/index.jsx";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    updateFormState(data) {
        this.setState(data);
        this.props.dispatch(updateFormData(data));
    }

    handleSubmit(e) {
        e.preventDefault();
        const url = '/api' + this.props.action;
        const formData = new FormData();
        Object.keys(this.state).map(e => formData.append(e, this.state[e]));
        axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(res => {
                if(res.data.errors) {
                    this.props.dispatch(updateFormErrors(res.data.errors));
                } else {
                    this.props.dispatch(updateForm(null));
                    this.props.dispatch(redirect(res.data.redirect));
                }
            })
            .catch(err => {
                console.error(err);
                this.props.dispatch(redirect('/error'));
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
            case 'button':
                return <Button key={i}
                               {...field.props}/>;
            case 'addDocument':
                return <AddDocument key={i}
                                    {...field.props}
                                    error={this.props.errors && this.props.errors[field.props.name]}
                                    updateState={data => this.updateFormState(data)}/>;
            case 'heading':
                return <h2 key={i} className="heading-medium">{field.props.label}</h2>;
        }
    }

    render() {
        const {errors, method, defaultActionLabel, children, fields, action} = this.props;
        return (
            <Fragment>
                {errors && <ErrorSummary errors={errors}/>}
                <form
                    action={'/api' + action + '?noScript=true'}
                    method={method}
                    onSubmit={e => this.handleSubmit(e)}
                    encType="multipart/form-data"
                >
                    {children}
                    {fields.map((field, i) => {
                        return this.renderFormComponent(field, i);
                    })}
                    <Submit label={defaultActionLabel}/>
                </form>
            </Fragment>
        );
    }
}

Form.defaultProps = {
    method: 'POST',
    defaultActionLabel: 'Submit'
};

const WrappedForm = props => (
    <ApplicationConsumer>
        {({dispatch, redirect}) => <Form {...props} dispatch={dispatch} redirect={redirect}/>}
    </ApplicationConsumer>
);

export default WrappedForm;