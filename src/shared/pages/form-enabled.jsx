import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Form from '../common/forms/form.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateForm,
    updateLocation,
    setError,
    updateApiStatus,
    clearApiStatus
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';

function withForm(Page) {

    class FormEnabled extends Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            const { match, dispatch } = this.props;
            dispatch(updateLocation(match));
            this.getFormFromServer();
        }

        getFormFromServer() {
            const { match, dispatch } = this.props;
            const { url } = match;
            dispatch(updateApiStatus(status.REQUEST_FORM))
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

        render() {
            const { form, match } = this.props;
            const { url, params } = match;
            if (form) {
                return (
                    <Page {...params} title={form.schema.title} form={form.meta} >
                        {form && form.schema && <Form
                            {...form}
                            action={url}
                            getForm={() => this.getFormFromServer()}
                        />}
                    </Page>
                );
            } else {
                return (
                    <h1 className="govuk-heading-l">
                        No Form
                    </h1>
                );
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