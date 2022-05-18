import React, { Fragment, useContext, useEffect } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setError, updateApiStatus, updateCaseActionData } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status';
import { actionComponentFactory } from './case-action-factory.jsx';

const CaseActions = () => {
    const { page, caseActionData, dispatch }  = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            return await axios.get(`/api/case/${page.params.caseId}/actions`);
        };

        fetchData().then( result => {
            dispatch(updateApiStatus(status.REQUEST_CASE_ACTION_DATA_SUCCESS));
            dispatch(updateCaseActionData(result.data));
        }, error => {
            dispatch(updateApiStatus(status.REQUEST_CASE_ACTION_DATA_FAILURE));
            dispatch(setError(error.response));
        });
    }, []);

    return (
        <Fragment>
            <h2 className="govuk-heading-m">Case actions</h2>
            { caseActionData && Object.keys(caseActionData).map(key => {
                return (
                    <>
                        { actionComponentFactory(key, caseActionData) }

                    </>
                );
            })}
        </Fragment>
    );
};

CaseActions.propTypes = {
    correspondents: PropTypes.array,
    page: PropTypes.object,
    summary: PropTypes.object
};

export default CaseActions;
