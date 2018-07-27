import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Submit from './submit.jsx';
import ErrorSummary from './error-summary.jsx';
import { formComponentFactory, secondaryActionFactory } from './form-repository.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { redirect, updateForm, updateFormData, updateFormErrors, setError } from '../../contexts/actions/index.jsx';

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props.data };
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
        Object.keys(this.state).map(field => {
            if (Array.isArray(this.state[field])) {
                this.state[field].map(value => {
                    formData.append(`${field}[]`, value);
                });
            } else {
                formData.append(field, this.state[field]);
            }
        });
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
                return this.props.dispatch(setError(err.response.data));
            });
    }

    render() {
        const {
            action,
            children,
            data,
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
                    {schema && schema.fields && schema.fields.map((field, key) => {
                        return formComponentFactory(field.component, {
                            key,
                            config: field.props,
                            data,
                            errors,
                            callback: this.updateFormState.bind(this)
                        });
                    })}
                    <Submit label={schema.defaultActionLabel} />
                    {schema && schema.secondaryActions && schema.secondaryActions.map((field, key) => {
                        return secondaryActionFactory(field.component, {
                            key,
                            config: field.props,
                            data,
                            errors,
                            callback: this.updateFormState.bind(this)
                        });
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