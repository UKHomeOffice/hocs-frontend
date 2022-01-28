import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../forms/form.jsx';
// import {clearApiStatus, setError, updateApiStatus, updateFormErrors} from "../../contexts/actions";
// import status from "../../helpers/api-status";
// import axios from "axios";
import { ApplicationConsumer } from '../../contexts/application.jsx';
import status from '../../helpers/api-status';
import axios from 'axios';

/**
 * Embedded form with a wrapped state, designed to be embedded outside of workflows or pages.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormEmbeddedWrapped = (props) => {
    const [formState, setFormState] = useState(props.fieldData);

    const setWrappedState = (data) => {
        setFormState((state) => (
            { ...state, ...data }
        ));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        props.dispatch()
            .then(() => {
                // eslint-disable-next-line no-undef
                const formData = new FormData();
                for (const [key, value] of Object.entries(formState)) {
                    formData.append(key, value);
                }
                axios.post(`/api/case/${props.page.params.caseId}/stage/${props.page.params.stageId}/data`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                        console.log(response);
                    });
            });
    };

            // const {dispatch, track, history, match: {url}} = props;
            //     const { form_schema, form_data, action } = this.state;
            //     dispatch(updateFormErrors(undefined));
            //
            //     // TODO: Remove
            //     /* eslint-disable-next-line no-undef */
            //     const formData = new FormData();
            //     Object.keys(form_data).filter(field => form_data[field] !== null).forEach(field => {
            //         if (Array.isArray(form_data[field])) {
            //             form_data[field].map(value => {
            //                 formData.append(`${field}[]`, value);
            //             });
            //         } else {
            //             formData.append(field, form_data[field]);
            //         }
            //     });
            //
            //     if(action) {
            //         formData.append('action', action);
            //     }
            //     return this.postForm(dispatch, form_schema.action, form_schema.title, url, formData, track, history);
            // }

    //
    // postForm(dispatch, action, formTitle, url, formData, track, history) {
    //     return dispatch(updateApiStatus(status.SUBMIT_FORM))
    //         .then(() => {
    //             axios.post('/api' + (action || url), formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    //                 .then(res => {
    //                     this.setState({ submittingForm: false });
    //                     return dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
    //                         .then(() => {
    //                             if (res.data.errors) {
    //                                 dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
    //                                     .then(() => dispatch(updateFormErrors(res.data.errors)))
    //                                     .then(() => track('EVENT', {
    //                                         category: formTitle,
    //                                         action: 'Submit',
    //                                         label: 'Validation Error'
    //                                     }));
    //                             } else {
    //                                 if (res.data.confirmation) {
    //                                     this.setState({ confirmation: res.data.confirmation });
    //                                     return dispatch(clearApiStatus());
    //                                 }
    //                                 if (res.data.redirect === url) {
    //                                     return dispatch(clearApiStatus())
    //                                         .then(() => this.getForm());
    //                                 }
    //
    //                                 return dispatch(clearApiStatus())
    //                                     .then((() => history.push(res.data.redirect)));
    //                             }
    //                         });
    //                 })
    //                 .catch(error => {
    //                     this.setState({ submittingForm: false });
    //                     return dispatch(updateApiStatus(status.SUBMIT_FORM_FAILURE))
    //                         .then(() => dispatch(setError(error.response)));
    //                 });
    //
    //         });
    // }


    return <Form
        page={props.page}
        schema={props.schema}
        updateFormState={setWrappedState}
        data={formState}
        action={`/case/${props.page.caseId}/stage/${props.page.stageId}`}
        baseUrl={`/case/${props.page.caseId}/stage/${props.page.stageId}`}
        submitHandler={submitHandler}
    />;
};

FormEmbeddedWrapped.propTypes = {
    page: PropTypes.object,
    schema: PropTypes.object,
    dispatch: PropTypes.func
};

const FormEmbeddedWrappedWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, page }) => <FormEmbeddedWrapped {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default FormEmbeddedWrappedWrapper;
