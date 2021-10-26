import React, { Fragment, useContext, useEffect, useCallback } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setError, updateApiStatus, updateCaseActionData } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status';
import { actionComponentFactory } from './case-action-factory.jsx';

const CaseActions = () => {
    const { page, caseActionData, dispatch }  = useContext(Context);

    // todo: make call to get action data
    const fetchCaseActionData = useCallback(async (caseId, dispatch) => {
        dispatch(updateApiStatus(status.REQUEST_CASE_ACTION_DATA));
        axios.get(`/api/case/${caseId}/actions`)
            .then( result => {
                dispatch(updateApiStatus(status.REQUEST_CASE_ACTION_DATA_SUCCESS));
                dispatch(updateCaseActionData(result.data));
            }, error => {
                dispatch(updateApiStatus(status.REQUEST_CASE_ACTION_DATA_FAILURE));
                dispatch(setError(error.response));
            });
    }, []);

    useEffect(() => {
        fetchCaseActionData(page.params.caseId, dispatch);
    }, [fetchCaseActionData]);

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


            {/*<h3 className="govuk-heading-s">Extensions</h3>*/}
            {/*{summary?.case &&*/}
            {/*    <>*/}
            {/*        <span className="govuk-body full-width">Current due date: {summary.case.deadline} {pitExtensionApplied && <span className="govuk-body">(PIT Extension Applied)</span>}</span>*/}
            {/*        <p className='govuk-body'>Apply an extension to this case.</p>*/}
            {/*        {!pitExtensionApplied &&*/}
            {/*        <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/actions_tab/extend_foi_deadline`} >*/}
            {/*        Extend this case</Link>}*/}
            {/*    </>*/}
            {/*}*/}
            {/*<hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>*/}
            {/*<h3 className="govuk-heading-s">Appeals</h3>*/}
            {/*<p className='govuk-body'>Record an appeal against this request.</p>*/}

            {/*{somuType &&*/}
            {/*    <>*/}
            {/*        <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/somu/${somuType.uuid}/APPEAL/FOI/MANAGE_APPEALS?hideSidebar=false`} >*/}
            {/*            Manage appeals</Link>*/}
            {/*    </>*/}
            {/*}*/}

        </Fragment>
    );
};

CaseActions.propTypes = {
    correspondents: PropTypes.array,
    page: PropTypes.object,
    summary: PropTypes.object
};

export default CaseActions;
