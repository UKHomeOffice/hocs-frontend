import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorSummary from './error-summary.jsx';
import Text from './text.jsx';
import Radio from './radio-group.jsx';
import Date from './date.jsx';
import Checkbox from './checkbox-group.jsx';
import Submit from './submit.jsx';
import TextArea from './text-area.jsx';
import AddDocument from './composite/document-add.jsx';
import Button from './button.jsx';
import BackLink from './backlink.jsx';
import Paragraph from './paragraph.jsx';
import Panel from './panel.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { redirect, updateForm, updateFormData, updateFormErrors } from '../../contexts/actions/index.jsx';
import Dropdown from './dropdown.jsx';

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
        const url = this.props.action;
        /* eslint-disable-next-line no-undef */
        const formData = new FormData();
        Object.keys(this.state).map(e => formData.append(e, this.state[e]));
        axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                if (res.data.errors) {
                    this.props.dispatch(updateFormErrors(res.data.errors));
                } else {
                    if (res.data.redirect === url) {
                        this.props.dispatch(updateForm(null));
                        return this.props.getForm();
                    }
                    this.props.dispatch(updateForm(null));
                    this.props.dispatch(redirect(res.data.redirect));
                }
            })
            .catch(err => {
                /* eslint-disable-next-line no-console */
                console.error(err);
                this.props.dispatch(redirect('/error'));
            });
    }

    renderFormComponent(field, i) {
        switch (field.component) {
        case 'radio':
            return <Radio key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                value={this.props.data && this.props.data[field.props.name]}
                updateState={data => this.updateFormState(data)} />;
        case 'text':
            return <Text key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                value={this.props.data && this.props.data[field.props.name]}
                updateState={data => this.updateFormState(data)} />;
        case 'date':
            return <Date key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                value={this.props.data && this.props.data[field.props.name]}
                updateState={data => this.updateFormState(data)} />;
        case 'checkbox':
            return <Checkbox key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                // TODO: implement value={}
                updateState={data => this.updateFormState(data)} />;
        case 'text-area':
            return <TextArea key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                value={this.props.data && this.props.data[field.props.name]}
                updateState={data => this.updateFormState(data)} />;
        case 'dropdown':
            return <Dropdown key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                value={this.props.data && this.props.data[field.props.name]}
                updateState={data => this.updateFormState(data)} />;
        case 'button':
            return <Button key={i}
                {...field.props} />;

        case 'addDocument':
            return <AddDocument key={i}
                {...field.props}
                error={this.props.errors && this.props.errors[field.props.name]}
                updateState={data => this.updateFormState(data)} />;

        // Non-form elements:
        case 'backlink':
            return <BackLink key={i}
                {...field.props} />;
        case 'heading':
            return <h2 key={i} className="heading-medium">{field.props.label}</h2>;
        case 'panel':
            return <Panel key={i}
                {...field.props} />;
        case 'paragraph':
            return <Paragraph key={i}
                {...field.props} />;

        }
    }

    renderSecondaryAction(field, i) {
        switch (field.component) {
        // Whitelist of boring elements that are allowed to be below the "submit" button
        case 'backlink':
        case 'button':
            return this.renderFormComponent(field, i);
        default:
            return null;
        }
    }

    render() {
        const {
            action,
            children,
            errors,
            method,
            schema
        } = this.props;
        return (
            <Fragment>
                {errors && <ErrorSummary errors={errors} />}
                <form
                    action={action + '?noScript=true'}
                    method={method}
                    onSubmit={e => this.handleSubmit(e)}
                    encType="multipart/form-data"
                >
                    {children}
                    {schema && schema.fields.map((field, i) => {
                        return this.renderFormComponent(field, i);
                    })}
                    <Submit label={schema.defaultActionLabel} />
                    {schema && schema.secondaryActions && schema.secondaryActions.map((field, i) => {
                        return this.renderSecondaryAction(field, i);
                    })}
                </form>
            </Fragment>
        );
    }
}

Form.propTypes = {
    action: PropTypes.string,
    children: PropTypes.node,
    secondaryActions: PropTypes.node,
    data: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    errors: PropTypes.object,
    getForm: PropTypes.func.isRequired,
    method: PropTypes.string,
    schema: PropTypes.object.isRequired
};

Form.defaultProps = {
    defaultActionLabel: 'Submit',
    method: 'POST'
};

const WrappedForm = props => (
    <ApplicationConsumer>
        {({ dispatch, redirect }) => <Form {...props} dispatch={dispatch} redirect={redirect} />}
    </ApplicationConsumer>
);

export default WrappedForm;