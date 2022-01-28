import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../forms/form.jsx';
import { ApplicationConsumer, Context } from '../../contexts/application.jsx';
import status from '../../helpers/api-status';
import axios from 'axios';
import {clearApiStatus, updateApiStatus, updateCaseData} from '../../contexts/actions/index.jsx';

/**
 * Embedded form with a wrapped state, designed to be embedded outside of workflows or pages.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormEmbeddedWrapped = (props) => {
    const [formState, setFormState] = useState(props.fieldData);
    const { dispatch } = React.useContext(Context);

    const setWrappedState = (data) => {
        setFormState((state) => (
            { ...state, ...data }
        ));
    };

    const submitHandler = React.useCallback(e => {
        e.preventDefault();

        // eslint-disable-next-line no-undef
        const formData = new FormData();
        for (const [key, value] of Object.entries(formState)) {
            formData.append(key, value);
        }
        dispatch(updateApiStatus(status.REQUEST_CASE_DATA))
            .then(() => {
                axios.post(`/api/case/${props.page.params.caseId}/stage/${props.page.params.stageId}/data`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(() => {
                        dispatch(updateApiStatus(status.REQUEST_CASE_DATA_SUCCESS))
                            .then(() => dispatch(clearApiStatus()))
                            .then(() => dispatch(updateCaseData(formState)));
                    })
                    .catch(() => console.error('Failed to submit case data'));
            });
    }, [formState]);

    return <Form
        page={props.page}
        schema={props.schema}
        updateFormState={setWrappedState}
        data={formState}
        action={`/case/${props.page.params.caseId}/stage/${props.page.params.stageId}/data`}
        baseUrl={`/case/${props.page.params.caseId}/stage/${props.page.params.stageId}`}
        submitHandler={submitHandler}
    />;
};

FormEmbeddedWrapped.propTypes = {
    page: PropTypes.object,
    schema: PropTypes.object,
    dispatch: PropTypes.func,
    fieldData: PropTypes.object,
    setLinkedDisplayData: PropTypes.func
};

const FormEmbeddedWrappedWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, page }) => <FormEmbeddedWrapped {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default FormEmbeddedWrappedWrapper;
