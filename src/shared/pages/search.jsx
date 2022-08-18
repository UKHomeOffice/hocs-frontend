import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Context } from '../contexts/application.jsx';
import { unsetForm, updateApiStatus, passForwardProps } from '../contexts/actions/index.jsx';
import Form from '../common/forms/form.new.jsx';
import Confirmation from '../common/components/confirmation.jsx';
import status from '../helpers/api-status.js';

// @TODO: ESLint false positive
// eslint-disable-next-line react/display-name,react/prop-types
const FormWrapper = (C) => ({ match, history, ...props }) => {
    const { dispatch, form: contextForm, layout } = useContext(Context);

    const [form, setForm] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const maxSearchResults = layout.maxSearchResults;

    const getForm = () => {
        dispatch(updateApiStatus(status.REQUEST_FORM))
            // @TODO: ESLint false positive
            // eslint-disable-next-line react/prop-types
            .then(() => axios.get('/api/form' + match.url))
            .then(response => setForm(response.data))
            .then(() => dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS)));
    };

    const submitHandler = event => {
        event.preventDefault();
        /* eslint-disable-next-line no-undef */
        const formData = new FormData();
        const { data } = form;
        Object.keys(form.data).filter(field => data[field] !== null).forEach(field => {
            formData.append(field, data[field]);
        });
        dispatch(updateApiStatus(status.SUBMIT_FORM))
            // @TODO: ESLint false positive
            // eslint-disable-next-line react/prop-types
            .then(() => axios.post('/api' + (form.schema.action || match.url), formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
            .then(({ data }) => {
                if (data.errors) {
                    dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                        .then(() => setForm({ ...form, errors: data.errors }));
                } else {
                    dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                        .then(() => {
                            const { workstack } = data.forwardProps;
                            if (workstack.items.length === maxSearchResults) {
                                workstack.errors = {
                                    searchLimitError: `The search has been capped to ${maxSearchResults} results.  Please narrow your search criteria.`
                                };
                                workstack.errorHeading = `Only the first ${maxSearchResults} results have been displayed`;
                            }
                        })
                        .then(() => dispatch(passForwardProps(data.forwardProps)))
                        .then(() => {
                            if (data.confirmation) {
                                setConfirmation(data.confirmation);
                            }
                            // @TODO: ESLint false positive
                            // eslint-disable-next-line react/prop-types
                            if (data.redirect === match.url) {
                                getForm();
                            }
                            // @TODO: ESLint false positive
                            // eslint-disable-next-line react/prop-types
                            history.push(data.redirect);
                        });
                }
            });
    };

    const updateFormData = useCallback((data) => {
        setForm({ ...form, data: { ...form.data, ...data } });
    }, [form]);

    useEffect(() => {
        if (contextForm && contextForm.schema) {
            setForm(contextForm);
            dispatch(unsetForm());
        } else {
            getForm();
        }
    }, []);

    return form ? (
        <C {...props} title={form.schema.title}>
            {confirmation && <Confirmation>{confirmation.summary}</Confirmation>}
            {/* @TODO: ESLint false positive */}
            {/* eslint-disable-next-line react/prop-types */}
            <Form {...form} action={form.schema.action || match.url} submitHandler={submitHandler} updateFormState={updateFormData} />
        </C>
    ) : null;
};

FormWrapper.displayName = 'FormWrapper';

FormWrapper.propTypes = {
    match: PropTypes.object,
    history: PropTypes.array
};

const Search = ({ children, title }) => (
    <div className='govuk-grid-row'>
        <div className='govuk-grid-column-one-half'>
            <h1 className='govuk-heading-l'>
                {title}
            </h1>
            {children}
        </div>
    </div>
);

Search.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    form: PropTypes.object
};

export default FormWrapper(Search);
