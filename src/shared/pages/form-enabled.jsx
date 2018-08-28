import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from '../common/forms/form.jsx';
import Panel from '../common/forms/panel.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateForm,
    updateFormData,
    updateFormErrors,
    setError,
    updateApiStatus,
    clearApiStatus,
    unsetForm
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import BackLink from '../common/forms/backlink.jsx';

function withForm(Page) {

    class FormEnabled extends Component {

        constructor(props) {
            super(props);
            this.state = { formData: {} };
        }

        componentDidMount() {
            const { form } = this.props;
            if (!form) {
                this.getForm();
            }
        }

        componentWillUnmount() {
            const { dispatch } = this.props;
            return dispatch(unsetForm());
        }

        shouldComponentUpdate(nextProps, nextState) {
            return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
                || (JSON.stringify(this.state) !== JSON.stringify(nextState));
        }

        getForm() {
            const { dispatch, match: { url } } = this.props;
            const endpoint = `/forms${url}`;
            return dispatch(updateApiStatus(status.REQUEST_FORM))
                .then(() => {
                    axios.get(endpoint)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS))
                                .then(() => dispatch(updateForm(response.data)))
                                .then(() => dispatch(clearApiStatus()))
                                .catch(error => {
                                    dispatch(updateApiStatus(status.UPDATE_FORM_FAILURE))
                                        .then(dispatch(setError(error)));
                                });
                        })
                        .catch(({ response }) => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_FAILURE))
                                .then(() => dispatch(setError(response.data)));
                        });

                });
        }

        submitHandler(e) {
            e.preventDefault();
            const { dispatch, form,  history, match: { url } } = this.props;
            /* eslint-disable-next-line no-undef */
            const formData = new FormData();
            Object.keys(form.data).map(field => {
                if (Array.isArray(form.data[field])) {
                    form.data[field].map(value => {
                        formData.append(`${field}[]`, value);
                    });
                } else {
                    formData.append(field, form.data[field]);
                }
            });
            return dispatch(updateApiStatus(status.SUBMIT_FORM))
                .then(() => {
                    axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(res => {
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                                .then(() => {
                                    if (res.data.errors) {
                                        dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                            .then(() => dispatch(updateFormErrors(res.data.errors)));

                                    } else {
                                        if (res.data.confirmation) {
                                            this.setState({ confirmation: res.data.confirmation });
                                            return dispatch(clearApiStatus());
                                        }
                                        if (res.data.redirect === url) {
                                            return dispatch(updateForm(null))
                                                .then(() => dispatch(clearApiStatus()))
                                                .then(() => this.getForm());
                                        }
                                        return dispatch(updateForm(null))
                                            .then(() => dispatch(clearApiStatus()))
                                            .then((() => history.push(res.data.redirect)));
                                    }
                                });
                        })
                        .catch(err => {
                            /* eslint-disable-next-line no-console */
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_FAILURE))
                                .then(() => dispatch(setError(err.response.data)));
                        });

                });
        }

        updateState(data) {
            this.props.dispatch(updateFormData(data));
        }

        renderConfirmation() {
            return (
                <Fragment>
                    <Panel title='Success'>
                        {this.state.confirmation.summary}
                    </Panel >
                    <BackLink />
                </Fragment>
            );
        }

        renderForm() {
            const { form, match: { url } } = this.props;
            return (
                <Page title={form.schema.title} form={form.meta} >
                    {form.schema && <Form
                        {...form}
                        action={url}
                        submitHandler={this.submitHandler.bind(this)}
                        updateFormState={this.updateState.bind(this)}
                    />}
                </Page>
            );
        }

        render() {
            const { form } = this.props;
            const { confirmation } = this.state;
            return (
                <Fragment>
                    {confirmation && this.renderConfirmation()}
                    {!confirmation && form && form.schema && this.renderForm()}
                </Fragment>
            );
        }
    }

    FormEnabled.propTypes = {
        dispatch: PropTypes.func.isRequired,
        form: PropTypes.object,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    };

    return FormEnabled;

}

const FormEnabledWrapper = Page => {
    return function withApplicationContext(props) {
        const WrappedPage = withForm(Page);
        return (
            <ApplicationConsumer>
                {({ dispatch, form }) => (
                    <WrappedPage
                        {...props}
                        dispatch={dispatch}
                        form={form}
                    />
                )}
            </ApplicationConsumer>
        );
    };
};

export default FormEnabledWrapper;