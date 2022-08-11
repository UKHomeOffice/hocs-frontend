import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../forms/form.jsx';
import { ApplicationConsumer, Context } from '../../contexts/application.jsx';
import { clearApiStatus, updateApiStatus } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status';
import axios from 'axios';

/**
 * Embedded form with a wrapped state, designed to be embedded outside of workflows or pages.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormEmbeddedWrapped = (props) => {
    const { dispatch } = React.useContext(Context);

    const [formData, setFormData] = useState(props.fieldData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const submitHandler = (e) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        const { action } = props;
        setSubmitting({ submittingForm: true });

        // eslint-disable-next-line no-undef
        const submissionFormData = new FormData();
        for(const [key, value] of Object.entries(formData)) {
            if (!value) {
                continue;
            }

            if (Array.isArray(value)) {
                value.map(arrVal => {
                    submissionFormData.append(`${key}[]`, arrVal);
                });
            } else {
                submissionFormData.append(key, value);
            }
        }

        return dispatch(updateApiStatus(status.UPDATE_CASE_DATA))
            .then(() => {
                axios.post(action,
                    submissionFormData,
                    { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then((res) => {
                        if (res.data.errors) {
                            dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                .then(() => setError(res.data.errors));
                        } else {
                            dispatch(updateApiStatus(status.UPDATE_CASE_DATA_SUCCESS))
                                .then(() => setError(null));
                        }
                    })
                    .then(() => {
                        dispatch(clearApiStatus());
                    })
                    .catch(() => {
                        dispatch(updateApiStatus(status.UPDATE_CASE_DATA_FAILURE));
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            })
            .catch(() => {
                dispatch(updateApiStatus(status.REQUEST_CASE_DATA_FAILURE));
            });
    };

    const updateFormData = (data) => {
        setFormData({ ...formData, ...data });
    };

    return <Form
        page={props.page}
        schema={props.schema}
        updateFormState={updateFormData}
        errors={error}
        data={formData}
        action={props.action}
        baseUrl={props.baseUrl}
        submitHandler={submitHandler}
        submittingForm={submitting}
        summary={props.schema.summary}
    />;
};

FormEmbeddedWrapped.propTypes = {
    page: PropTypes.object,
    schema: PropTypes.object,
    dispatch: PropTypes.func,
    fieldData: PropTypes.object,
    submitHandler: PropTypes.func,
    action: PropTypes.string,
    baseUrl: PropTypes.string
};

const FormEmbeddedWrappedWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, page }) => <FormEmbeddedWrapped {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default FormEmbeddedWrappedWrapper;
