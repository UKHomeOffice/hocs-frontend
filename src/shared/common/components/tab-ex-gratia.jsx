import React, { useContext, useEffect, Fragment, useCallback, useState } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import status from '../../helpers/api-status';
import { updateApiStatus } from '../../contexts/actions/index.jsx';
import updateCaseData from '../../helpers/case-data-helper';
import Submit from '../forms/submit.jsx';
import axios from 'axios';

const TabExGratia = () => {
    const { caseData, dispatch, page } = useContext(Context);
    const [form, setForm] = useState(null);

    // update when updates are sent to the api
    const fetchCaseData = useCallback(() => {
        dispatch(updateApiStatus(status.REQUEST_CASE_DATA));
        updateCaseData(page.params.caseId, dispatch);
    }, [updateCaseData]);

    useEffect(() => {
        fetchCaseData();
    }, [fetchCaseData]);

    useEffect(() => {
        getForm();
    }, []);

    const getForm = () => {
        dispatch(updateApiStatus(status.REQUEST_FORM))
            .then(() => axios.get('/api/schema/EX_GRATIA/fields'))
            .then(response => setForm(response))
            .then(() => dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS)));
    };

    return (
        <Fragment>
            {(caseData && Object.keys(caseData).length !== 0) &&
            <Fragment>
                <h2 className='govuk-heading-m'>Ex-Gratia</h2>
                <details className='govuk-details'>
                    <summary className='govuk-details__summary'>
                        <span className='govuk-details__summary-text'>
                            Update Ex-Gratia details
                        </span>
                    </summary>
                    <div className='govuk-details__text'>
                        <form action={`/case/${page.params.caseId}/stage/${page.params.stageId}/note`}>
                            <div className={'govuk-form-group'}>

                                <label htmlFor={'case-note'} id={'case-note-label'} className='govuk-label govuk-label--s'>Case note</label>

                                {/*{submissionError && <span id={'case-note-error'} className='govuk-error-message'>{submissionError}</span>}*/}

                                <textarea className={'govuk-textarea form-control-3-4'}
                                    id='case-note'
                                    name='case-note'
                                    disabled={false}
                                    rows={5}
                                    onBlur={e => this.setState({ caseNote: e.target.value })}
                                    onChange={e => this.setState({ caseNote: e.target.value })}
                                    // value={caseNote}
                                />
                            </div>
                            <Submit label='Add' />
                        </form>
                    </div>
                </details>
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
