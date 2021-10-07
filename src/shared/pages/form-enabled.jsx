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
    unsetCaseNotes,
    unsetCaseSummary,
    unsetDocuments,
    unsetForm,
    updateFormErrors,
    updatePageMeta
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import BackLink from '../common/forms/backlink.jsx';
import  updateSummary from '../helpers/summary-helpers';

function withForm(Page) {

    class FormEnabled extends Component {

        constructor(props) {
            super(props);
            const { confirmation, form } = props;
            const { data, schema, meta } = form ? form : {};
            this.state = {
                confirmation,
                form_data: data,
                form_schema: schema,
                form_meta: meta,
                submittingForm: false
            };
        }

        componentDidMount() {
            const { dispatch, track, form, match } = this.props;
            const { schema } = form || {};
            if (this.state.form_schema) {
                track('PAGE_VIEW', { title: this.state.form_schema.title, path: match.url });
            }
            dispatch(updatePageMeta(match))
                .then(() => {
                    if (!schema) {
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
            const { dispatch, match: { url }, history, page } = this.props;
            const endpoint = '/api/form' + url;

            return dispatch(updateApiStatus(status.REQUEST_FORM))
                .then(() => {
                    axios.get(endpoint)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS))
                                .then(() => {
                                    dispatch(unsetCaseNotes());
                                    dispatch(unsetCaseSummary());
                                    dispatch(unsetDocuments());

                                    if (page.params.caseId) { // if a caseId is supplied, pull its summary
                                        updateSummary(page.params.caseId, dispatch);
                                    }
                                })
                                .then(() => {
                                    if (response.data.redirect) {
                                        history.push(response.data.redirect);
                                    } else {
                                        this.setState({
                                            form_data: response.data.data,
                                            form_schema: response.data.schema,
                                            form_meta: response.data.meta
                                        });
                                        dispatch(updateFormErrors(response.data.errors));
                                    }
                                })
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

        switchDirection(e, direction) {
            e.preventDefault();

            const { dispatch, history } = this.props;
            const endpoint =
                `/api/form/case/${this.props.page.params.caseId}/stage/${this.props.page.params.stageId}/direction/${direction}`;
            return dispatch(updateApiStatus(status.MOVE_BACK_REQUEST))
                .then(() => {
                    axios.get(endpoint)
                        .then(response => {
                            if (response.data.errors) {
                                dispatch(updateApiStatus(status.MOVE_BACK_FAILURE));
                            } else {
                                dispatch(updateApiStatus(status.MOVE_BACK_SUCCESS));
                                history.push(response.data.redirect);
                            }
                        }).then(() => dispatch(clearApiStatus()));
                })
                .catch(error => {
                    dispatch(updateApiStatus(status.MOVE_BACK_FAILURE))
                        .then(() => dispatch(setError(error.response)));
                });
        }

        submitHandler(e) {
            e.preventDefault();
            if (this.state.submittingForm !== true) {
                this.setState({ submittingForm: true });
                const { dispatch, track, history, match: { url } } = this.props;
                const { form_schema, form_data, action } = this.state;
                dispatch(updateFormErrors(undefined));

                // TODO: Remove
                /* eslint-disable-next-line no-undef */
                const formData = new FormData();
                Object.keys(form_data).filter(field => form_data[field] !== null).forEach(field => {
                    if (Array.isArray(form_data[field])) {
                        form_data[field].map(value => {
                            formData.append(`${field}[]`, value);
                        });
                    } else {
                        formData.append(field, form_data[field]);
                    }
                });

                if(action) {
                    formData.append('action', action);
                }
                return this.postForm(dispatch, form_schema.action, form_schema.title, url, formData, track, history);
            }
        }

        postForm(dispatch, action, formTitle, url, formData, track, history) {
            return dispatch(updateApiStatus(status.SUBMIT_FORM))
                .then(() => {
                    axios.post('/api' + (action || url), formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(res => {
                            this.setState({ submittingForm: false });
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                                .then(() => {
                                    if (res.data.errors) {
                                        dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                            .then(() => dispatch(updateFormErrors(res.data.errors)))
                                            .then(() => track('EVENT', {
                                                category: formTitle,
                                                action: 'Submit',
                                                label: 'Validation Error'
                                            }));
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
                            this.setState({ submittingForm: false });
                            return dispatch(updateApiStatus(status.SUBMIT_FORM_FAILURE))
                                .then(() => dispatch(setError(error.response)));
                        });

                });
        }
        updateState(data) {
            this.setState((state) => ({
                form_data: { ...state.form_data, ...data },
            }));
        }

        renderConfirmation() {
            return (
                <Fragment>
                    <Panel >
                        {this.state.confirmation}
                    </Panel >
                    <BackLink />
                </Fragment>
            );
        }

        renderForm() {
            const { form, match: { url, params }, hasSidebar } = this.props;
            const { form_data, form_meta, form_schema, submittingForm } = this.state;
            const { errors } = form || {};
            return (
                <Page title={form_schema.title} form={form_meta}
                    hasSidebar={hasSidebar || (form_schema.props && form_schema.props.hasSidebar)} >
                    {form_schema && <Form
                        {...{
                            schema: form_schema,
                            data: form_data,
                            errors: errors,
                            meta: form_meta,
                            page: params,
                            submittingForm: submittingForm
                        }}
                        action={form_schema.action || url}
                        submitHandler={this.submitHandler.bind(this)}
                        updateFormState={this.updateState.bind(this)}
                        switchDirection={this.switchDirection.bind(this)}
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
                {({ confirmation, dispatch, track, form, page }) => (
                    <WrappedPage
                        {...props}
                        confirmation={confirmation}
                        dispatch={dispatch}
                        track={track}
                        form={form}
                        page={page}
                    />
                )}
            </ApplicationConsumer>
        );
    };
};

export default FormEnabledWrapper;
