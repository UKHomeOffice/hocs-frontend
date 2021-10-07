import React, { Fragment, useContext, useState, useEffect, useCallback } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import updateSummary from '../../helpers/summary-helpers';
import { updateApiStatus } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status';

const FoiActions = () => {
    const { page, summary, dispatch }  = useContext(Context);
    const [somuType, setSomuType] = useState(undefined);

    const fetchSomuAppeals = useCallback( async () => {
        if (!somuType) {
            axios.get('/api/form/somu/somuCaseType/FOI/somuType/APPEAL/')
                .then(somuTypeResponse => {
                    // console.log(`GET: /api/form/case/${page.params.caseId}/somu/somuTypeUuid/${somuTypeResponse.data.uuid}/`);
                    setSomuType(somuTypeResponse.data);
                });
        }
    }, []);

    const fetchCaseSummaryData = useCallback(() => {
        dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY));
        updateSummary(page.params.caseId, dispatch);
    }, [updateSummary]);

    useEffect(() => {
        fetchSomuAppeals();
        fetchCaseSummaryData();
    }, [fetchSomuAppeals, fetchCaseSummaryData]);

    const pitExtensionApplied = summary?.case ? ('FOI_PIT' in summary.case.deadLineExtensions) : undefined;

    return (
        <Fragment>
            <h2 className="govuk-heading-m">Case actions</h2>
            <h3 className="govuk-heading-s">Extensions</h3>
            {summary?.case &&
                <>
                    <span className="govuk-body full-width">Current due date: {summary.case.deadline} {pitExtensionApplied && <span className="govuk-body">(PIT Extension Applied)</span>}</span>
                    <p className='govuk-body'>Apply an extension to this case.</p>
                    {!pitExtensionApplied &&
                    <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/actions_tab/extend_foi_deadline`} >
                    Extend this case</Link>}
                </>
            }
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>
            <h3 className="govuk-heading-s">Appeals</h3>
            <p className='govuk-body'>Record an appeal against this request.</p>

            {somuType &&
                <>
                    <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/somu/${somuType.uuid}/APPEAL/FOI/MANAGE_APPEALS?hideSidebar=false`} >
                        Manage appeals</Link>
                </>
            }

        </Fragment>
    );
};

FoiActions.propTypes = {
    correspondents: PropTypes.array,
    page: PropTypes.object,
    summary: PropTypes.object
};

export default FoiActions;
