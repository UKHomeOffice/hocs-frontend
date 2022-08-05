import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import status from '../../helpers/api-status';
import {
    updateApiStatus,
    unsetCaseData,
    clearApiStatus,
    updateCaseData,
} from '../../contexts/actions/index.jsx';
import axios from 'axios';
import FormEmbeddedWrapped from '../forms/form-embedded-wrapped.jsx';

const TabExGratia = () => {
    const { dispatch, page } = useContext(Context);
    const [form, setForm] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getForm();
        return function cleanup() {
            dispatch(unsetCaseData());
        };
    }, []);

    const getForm = () => {
        let schemaType = 'EX_GRATIA_TAB';

        dispatch(updateApiStatus(status.REQUEST_FORM))
            .then(() => axios.get(`/api/form/${schemaType}/case/${page.params.caseId}`))
            .then(({ data }) => setForm(data))
            .then(() => dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS)));
    };

    const submitHandler = (wrappedState, setWrappedState, actionDispatch) => {
        return React.useCallback(e => {
            e.preventDefault();
            setWrappedState({ submittingForm: true });

            let schemaType = 'EX_GRATIA_TAB';

            // eslint-disable-next-line no-undef
            const formData = new FormData();
            for (const [key, value] of Object.entries(wrappedState)) {
                formData.append(key, value);
            }
            actionDispatch(updateApiStatus(status.UPDATE_CASE_DATA))
                .then(() => {
                    axios.post(`/api/case/${page.params.caseId}/stage/${page.params.stageId}/form/${schemaType}/data?type=EX_GRATIA_UPDATE`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then((res) => {
                            if (res.data.errors) {
                                actionDispatch(updateApiStatus(status.SUBMIT_FORM_VALIDATION_ERROR))
                                    .then(() => setError(res.data.errors))
                                    .then(() => setWrappedState({ submittingForm: false }));
                            } else {
                                actionDispatch(updateApiStatus(status.UPDATE_CASE_DATA_SUCCESS))
                                    .then(() => setError(null))
                                    .then(() => actionDispatch(updateCaseData(wrappedState)))
                                    .then(() => setWrappedState({ submittingForm: false }));
                            }
                        })
                        .then(() => {
                            actionDispatch(clearApiStatus());
                        })
                        .catch(() => {
                            actionDispatch(updateApiStatus(status.UPDATE_CASE_DATA_FAILURE))
                                .then(() => setWrappedState({ submittingForm: false }));
                        });
                })
                .catch(() => {
                    actionDispatch(updateApiStatus(status.REQUEST_CASE_DATA_FAILURE))
                        .then(() => setWrappedState({ submittingForm: false }));
                });
        }, [wrappedState]);
    };

    return (
        <Fragment>
            {form &&
            <Fragment>
                <h2 className='govuk-heading-m'>{form.schema.title}</h2>
                <FormEmbeddedWrapped
                    schema={form.schema}
                    fieldData={ form.data }
                    errors={ error }
                    action={`/case/${page.params.caseId}/stage/${page.params.stageId}/data`}
                    baseUrl={`/case/${page.params.caseId}/stage/${page.params.stageId}`}
                    submitHandler={submitHandler}
                />
            </Fragment>
            }
        </Fragment>
    );
};

TabExGratia.propTypes = {
    page: PropTypes.object,
};

export default TabExGratia;
