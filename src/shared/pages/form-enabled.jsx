import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from '../common/forms/form.jsx';
import Panel from '../common/forms/panel.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    setError,
    updateApiStatus,
    clearApiStatus,
    unsetForm,
    updatePageMeta
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import BackLink from '../common/forms/backlink.jsx';

function withForm(Page) {

    class FormEnabled extends Component {

        constructor(props) {
            super(props);
            const { confirmation, form } = props;
            const { data, errors, schema, meta } = form ? form : {};
            this.state = {
                confirmation,
                form_data: data,
                form_errors: errors,
                form_schema: schema,
                form_meta: meta
            };
        }

        componentDidMount() {
            const { dispatch, form, match } = this.props;
            dispatch(updatePageMeta(match))
                .then(() => {
                    if (!form) {
                        return this.getForm();
                    }
                    dispatch(unsetForm());
                });
        }

        shouldComponentUpdate(nextProps, nextState) {
            return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
                || (JSON.stringify(this.state) !== JSON.stringify(nextState));
        }

        getForm() {
            const { dispatch, match: { url } } = this.props;
            const endpoint = '/api/form' + url;
            return dispatch(updateApiStatus(status.REQUEST_FORM))
                .then(() => {
                    axios.get(endpoint)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS))
                                .then(() => this.setState({
                                    form_data: response.data.data,
                                    form_errors: response.data.errors,
                                    form_schema: response.data.schema,
                                    form_meta: response.data.meta
                                }))
                                .then(() => dispatch(clearApiStatus()))
                                .catch(error => {
                                    dispatch(updateApiStatus(status.UPDATE_FORM_FAILURE))
                                        .then(dispatch(setError(error)));
                                });
                        })
                        .catch(error => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_FAILURE))
                                .then(() => dispatch(setError(error.response.data)));
                        });
                });
        }

        submitHandler(e) {
            e.preventDefault();
            const { dispatch, history, match: { url } } = this.props;
            const { form_data } = this.state;
            // TODO: Remove
            /* eslint-disable-next-line no-undef */
            const formData = new FormData();
            Object.keys(form_data).map(field => {
                if (Array.isArray(form_data[field])) {
                    form_data[field].map(value => {
                        formData.append(`${field}[]`, value);
                    });
                } else {
                    formData.append(field, form_data[field]);
                }
            });
            return dispatch(updateApiStatus(status.SUBMIT_FORM))
                .then(() => {
                    axios.post('/api' + url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(res => {
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                                .then(() => {
                                    if (res.data.errors) {
                                        dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                            .then(() => this.setState({ form_errors: res.data.errors }));

                                    } else {
                                        if (res.data.confirmation) {
                                            this.setState({ confirmation: res.data.confirmation });
                                            return dispatch(clearApiStatus());
                                        }
                                        if (res.data.redirect === url) {
                                            return dispatch(clearApiStatus())
                                                .then(() => this.getForm());
                                        }
                                        return dispatch(clearApiStatus())
                                            .then((() => history.push(res.data.redirect)));
                                    }
                                });
                        })
                        .catch(error => {
                            // TODO: Remove
                            /* eslint-disable-next-line no-console */
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_FAILURE))
                                .then(() => dispatch(setError(error.response.data)));
                        });

                });
        }

        updateState(data) {
            this.setState((state) => ({
                form_data: { ...state.form_data, ...data }
            }));
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
            const { match: { url } } = this.props;
            const { form_data, form_errors, form_meta, form_schema } = this.state;
            return (
                <Page title={form_schema.title} form={form_meta} >
                    {form_schema && <Form
                        {...{
                            schema: form_schema,
                            data: form_data,
                            errors: form_errors,
                            meta: form_meta
                        }}
                        action={url}
                        submitHandler={this.submitHandler.bind(this)}
                        updateFormState={this.updateState.bind(this)}
                    />}
                </Page>
            );
        }

        render() {
            const { confirmation, form_schema } = this.state;
            return (
                <Fragment>
                    {confirmation && this.renderConfirmation()}
                    {!confirmation && form_schema && this.renderForm()}
                </Fragment>
            );
        }
    }

    FormEnabled.propTypes = {
        confirmation: PropTypes.object,
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
                {({ confirmation, dispatch, form }) => (
                    <WrappedPage
                        {...props}
                        confirmation={confirmation}
                        dispatch={dispatch}
                        form={form}
                    />
                )}
            </ApplicationConsumer>
        );
    };
};

export default FormEnabledWrapper;