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
            const { dispatch, track, form, match } = this.props;
            if (this.state.form_schema) {
                track('PAGE_VIEW', { title: this.state.form_schema.title, path: match.url });
            }
            dispatch(updatePageMeta(match))
                .then(() => {
                    if (!form) {
                        return this.getForm();
                    }
                    dispatch(unsetForm());
                });
        }

        componentDidUpdate(prevProps, prevState) {
            const { track, match: { url } } = this.props;
            if (this.state.form_schema) {
                if (!prevState.form_schema || this.state.form_schema.title !== prevState.form_schema.title) {
                    track('PAGE_VIEW', { title: this.state.form_schema.title, path: url });
                }
            }
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
                                .catch(() => {
                                    dispatch(updateApiStatus(status.UPDATE_FORM_FAILURE))
                                        .then(dispatch(setError({ status: 500 })));
                                });
                        })
                        .catch(error => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_FAILURE))
                                .then(() => dispatch(setError(error.response)));
                        });
                });
        }

        submitHandler(e) {
            e.preventDefault();
            const { dispatch, track, history, match: { url } } = this.props;
            const { form_schema, form_data } = this.state;
            this.setState({ form_errors: undefined });
            // TODO: Remove
            /* eslint-disable-next-line no-undef */
            const formData = new FormData();
            Object.keys(form_data).filter(field => form_data[field] !== null && form_data[field] !== '').forEach(field => {
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
                    axios.post('/api' + (form_schema.action || url), formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(res => {
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                                .then(() => {
                                    if (res.data.errors) {
                                        dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                            .then(() => this.setState({ form_errors: res.data.errors }))
                                            .then(() => track('EVENT', { category: form_schema.title, action: 'Submit', label: 'Validation Error' }));

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
                                .then(() => dispatch(setError(error.response)));
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
                        {this.state.confirmation}
                    </Panel >
                    <BackLink />
                </Fragment>
            );
        }

        renderForm() {
            const { match: { url, params }, hasSidebar } = this.props;
            const { form_data, form_errors, form_meta, form_schema } = this.state;
            return (
                <Page title={form_schema.title} form={form_meta} hasSidebar={hasSidebar} >
                    {form_schema && <Form
                        {...{
                            schema: form_schema,
                            data: form_data,
                            errors: form_errors,
                            meta: form_meta,
                            page: params
                        }}
                        action={form_schema.action || url}
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
                {({ confirmation, dispatch, track, form }) => (
                    <WrappedPage
                        {...props}
                        confirmation={confirmation}
                        dispatch={dispatch}
                        track={track}
                        form={form}
                    />
                )}
            </ApplicationConsumer>
        );
    };
};

export default FormEnabledWrapper;