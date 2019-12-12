import React, { Fragment, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Context } from '../contexts/application.jsx';
import {
    updateApiStatus,
    unsetForm,
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import DashboardCards from '../common/components/dashboard.jsx';
import Form from '../common/forms/form.new.jsx';

const Dashboard = ({ title, match, history }) => {
    const { dispatch, track, form: contextForm } = useContext(Context);

    const [form, setForm] = useState(contextForm);

    const getPage = () => {
        if (contextForm) {
            dispatch(unsetForm());
            return;
        }
        dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA))
            .then(() => axios.get('/api/form'))
            .then(response => setForm(response.data))
            .then(() => dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA_SUCCESS)))
            .catch(() => dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA_FAILURE)));
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
                            if (data.redirect) {
                                history.push(data.redirect);
                            }
                        });
                }
            });
    };

    useEffect(() => {
        if (contextForm && contextForm.schema) {
            setForm(contextForm);
            dispatch(unsetForm());
        } else {
            getPage();
        }
        track('PAGE_VIEW', { title, path: match.url });
    }, [contextForm]);

    return form && form.schema ? (
        <Fragment>
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-one-third'>
                    {form.schema.title && <h1 className='govuk-heading-l'>{form.schema.title}</h1>}
                    <Form {...form} action={form.schema.action || match.url} submitHandler={submitHandler} showErrorSummary={false} updateFormState={() => { }} />
                </div>
            </div>
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-full'>
                    <h1 className='govuk-heading-l'>Dashboard</h1>
                    <h2 className='govuk-heading-m'>My Cases</h2>
                    {form.meta.dashboard && form.meta.dashboard.user && <DashboardCards dashboard={form.meta.dashboard.user} absoluteUrl={'/workstack/user'} alwaysLink={true} alwaysShow={false} />}
                    <h2 className='govuk-heading-m'>Team Cases</h2>
                    {form.meta.dashboard && form.meta.dashboard.teams && <DashboardCards dashboard={form.meta.dashboard.teams} baseUrl={'/workstack'} alwaysLink={true} alwaysShow={true} />}
                </div>
            </div>
        </Fragment>
    ) : null;
};

Dashboard.propTypes = {
    match: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    dashboard: PropTypes.array
};

export default Dashboard;