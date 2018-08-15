import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from '../common/forms/form.jsx';
import Panel from '../common/forms/panel.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateForm,
    updateFormData,
    updateFormErrors,
    updateLocation,
    setError,
    redirect,
    updateApiStatus,
    clearApiStatus,
    redirected,
    unsetForm,
    unsetError

} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';

function withForm(Page) {

    class FormEnabled extends Component {

        constructor(props) {
            super(props);
            this.state = { ...props, formData: {} };
        }

        componentDidMount() {
            const { match, dispatch } = this.props;
            dispatch(updateLocation(match))
                .then(() => {
                    if (this.props.redirect) {
                        this.props.dispatch(redirected());
                    }
                });
            this.getFormFromServer();
        }

        componentWillUnmount() {
            this.props.dispatch(unsetForm());
            this.props.dispatch(unsetError());
        }

        getFormFromServer() {
            const { match, dispatch } = this.props;
            const { url } = match;
            {
                return dispatch(updateApiStatus(status.REQUEST_FORM))
                    .then(() => {
                        axios.get(`/forms/${url}`)
                            .then(res => {
                                dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS))
                                    .then(() => dispatch(updateForm(res.data)))
                                    .then(() => dispatch(clearApiStatus()))
                                    .catch(error => {
                                        dispatch(updateApiStatus(status.UPDATE_FORM_FAILURE));
                                        dispatch(setError(error));
                                    });
                            })
                            .catch(({ response }) => {
                                dispatch(updateApiStatus(status.REQUEST_FORM_FAILURE));
                                dispatch(setError(response.data));
                            });
                    });
            }
        }

        submitHandler(e) {
            e.preventDefault();
            const { match: { url }, dispatch } = this.props;
            /* eslint-disable-next-line no-undef */
            const formData = new FormData();
            Object.keys(this.state.formData).map(field => {
                if (Array.isArray(this.state.formData[field])) {
                    this.state.formData[field].map(value => {
                        formData.append(`${field}[]`, value);
                    });
                } else {
                    formData.append(field, this.state.formData[field]);
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
                                            .then(() => dispatch(redirect(res.data.redirect)));
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
            this.setState({ formData: data });
            this.props.dispatch(updateFormData(data));
        }

        renderConfirmation() {
            return (
                <Panel>
                    {this.state.confirmation.summary}
                </Panel >
            );
        }

        renderForm() {
            const { form, match } = this.props;
            const { url, params } = match;
            return (
                <Page {...params} title={form.schema.title} form={form.meta} >
                    {form.schema && <Form
                        {...form}
                        action={url}
                        getForm={this.getFormFromServer.bind(this)}
                        submitHandler={this.submitHandler.bind(this)}
                        updateFormState={this.updateState.bind(this)}
                    />}
                </Page>
            );
        }

        render() {
            const { form } = this.props;
            const { confirmation } = this.state;
            if (confirmation) {
                return this.renderConfirmation();
            } else if (form && form.schema) {
                return this.renderForm();
            } else {
                return null;
            }
        }
    }

    FormEnabled.propTypes = {
        dispatch: PropTypes.func.isRequired,
        form: PropTypes.object,
        match: PropTypes.object
    };

    return FormEnabled;

}

const FormEnabledWrapper = Page => {
    return function withApplicationContext(props) {
        const WrappedPage = withForm(Page);
        return (
            <ApplicationConsumer>
                {({ dispatch, form, redirect }) => (
                    <WrappedPage
                        {...props}
                        dispatch={dispatch}
                        form={form}
                        redirect={redirect}
                    />
                )}
            </ApplicationConsumer>
        );
    };

};

export default FormEnabledWrapper;