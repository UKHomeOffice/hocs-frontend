import React, { useContext, useEffect, Fragment, useCallback } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import status from '../../helpers/api-status';
import { updateApiStatus } from '../../contexts/actions/index.jsx';
import updateCaseData from '../../helpers/case-data-helper';
import updateSummary from '../../helpers/summary-helpers';

// const renderRow = ({ label, value }) => {
//     return (
//         <tr key={label} className='govuk-table__row'>
//             <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>{label}</th>
//             <td className='govuk-table__cell'>{value}</td>
//         </tr>
//     );
// };
//
// renderRow.propTypes = {
//     label: PropTypes.string.isRequired,
//     value: PropTypes.string.isRequired
// };

const TabExGratia = () => {
    const { caseData, dispatch, page } = useContext(Context);

    // update when updates are sent to the api
    const fetchCaseData = useCallback(() => {
        dispatch(updateApiStatus(status.REQUEST_CASE_DATA));
        updateCaseData(page.params.caseId, dispatch);
    }, [updateCaseData]);

    useEffect(() => {
        fetchCaseData();
    }, [fetchCaseData]);

    return (
        <Fragment>
            {(caseData && Object.keys(caseData).length !== 0) &&
            <Fragment>
                <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/document/manage`} >Add Ex-Gratia details</Link>
                <h2 className='govuk-heading-m'>Ex-Gratia</h2>
                <table className='govuk-table margin-left--small'>
                    <caption className='govuk-table__caption margin-bottom--small' >Summary</caption>
                    <tbody className='govuk-table__body'>
                        {caseData.PaymentType && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Payment type</th>
                            <td className='govuk-table__cell'>{caseData.PaymentType}</td>
                        </tr>}
                        {caseData.AmountComplainantRequested && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Amount complainant has requested:</th>
                            <td className='govuk-table__cell'>{caseData.AmountComplainantRequested}</td>
                        </tr>}
                        {caseData.AmountBusinessRequested && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Amount requested from the business/port:</th>
                            <td className='govuk-table__cell'>{caseData.AmountBusinessRequested}</td>
                        </tr>}
                        {caseData.AmountOfferSent && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Offer sent to the complainant:</th>
                            <td className='govuk-table__cell'>{caseData.AmountOfferSent}</td>
                        </tr>}
                        {caseData.BusinessApproved && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Business area/port has approved payment:</th>
                            <td className='govuk-table__cell'>{caseData.BusinessApproved}</td>
                        </tr>}
                        {caseData.ComplaintAccepted && <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Complainant has accepted:</th>
                            <td className='govuk-table__cell'>{caseData.ComplaintAccepted}</td>
                        </tr>}
                    </tbody>
                </table>
            </Fragment>
            }
        </Fragment>
    );
};

TabExGratia.propTypes = {
    correspondents: PropTypes.array,
    page: PropTypes.object,
    summary: PropTypes.object
};

export default TabExGratia;
