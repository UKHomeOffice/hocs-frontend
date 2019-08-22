import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Context } from '../contexts/application.jsx';
import { unsetForm, updateApiStatus, passForwardProps } from '../contexts/actions/index.jsx';
import Form from '../common/forms/form.new.jsx';
import Confirmation from '../common/components/confirmation.jsx';
import status from '../helpers/api-status.js';

const FormWrapper = (C) => ({ match, history, ...props }) => {
    const { dispatch, track, form: contextForm, layout } = useContext(Context);

    const [form, setForm] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const maxSearchResults = layout.maxSearchResults;

    const getForm = () => {
        dispatch(updateApiStatus(status.REQUEST_FORM))
            .then(() => axios.get('/api/form' + match.url))
            .then(response => setForm(response.data))
            .then(() => dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS)));
    };

    const submitHandler = event => {
        event.preventDefault();
        /* eslint-disable-next-line no-undef */
        const formData = new FormData(event.target);
        dispatch(updateApiStatus(status.SUBMIT_FORM))
            .then(() => axios.post('/api' + (form.schema.action || match.url), formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
            .then(({ data }) => {
                if (data.errors) {
                    dispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                        .then(() => setForm({ ...form, errors: data.errors }))
                        .then(() => track('EVENT', { category: form.schema.title, action: 'Submit', label: 'Validation Error' }));
                } else {
                    dispatch(updateApiStatus(status.SUBMIT_FORM_SUCCESS))
                        .then(() => {
                            const { workstack } = data.forwardProps;
                            if (workstack.items.length === maxSearchResults) {
                                workstack.errors = [ `The search has been capped to ${maxSearchResults} results.  Please narrow your search criteria.` ];
                                workstack.errorHeading = `Only the first ${maxSearchResults} results have been displayed`;
                            }
                        })
                        .then(() => dispatch(passForwardProps(data.forwardProps)))
                        .then(() => {
                            if (data.confirmation) {
                                setConfirmation(data.confirmation);
                            }
                            if (data.redirect === match.url) {
                                getForm();
                            }
                            history.push(data.redirect);
                        });
                }
            });
    };

    useEffect(() => {
        if (contextForm) {
            setForm(contextForm);
            dispatch(unsetForm());
        } else {
            getForm();
        }
    }, []);

    return form ? (
        <C {...props} title={form.schema.title}>
            {confirmation && <Confirmation>{confirmation.summary}</Confirmation>}
            <Form {...form} action={form.schema.action || match.url} submitHandler={submitHandler} />
        </C>
    ) : null;
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