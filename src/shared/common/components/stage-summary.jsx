import React, {  useContext, useEffect, Fragment } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import { updateSummary } from '../../helpers/summary-helpers.jsx';


const renderActiveStage = ({ stage, assignedTeam, assignedUser }) => {
    return (
        <table key={stage} className='govuk-table margin-left--small'>
            <caption className='govuk-table__caption margin-bottom--small' >{stage}</caption>
            <tbody className='govuk-table__body'>
                <tr className='govuk-table__row'>
                    <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Team</th>
                    <td className='govuk-table__cell'>{assignedTeam}</td>
                </tr>
                <tr className='govuk-table__cell'>
                    <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>User</th>
                    <td className='govuk-table__cell'>{assignedUser}</td>
                </tr>
            </tbody>
        </table>
    );
};

renderActiveStage.propTypes = {
    stage: PropTypes.object.isRequired,
    assignedTeam: PropTypes.string,
    assignedUser: PropTypes.string
};

const renderRow = ({ label, value }) => {
    return (
        <tr key={label} className='govuk-table__row'>
            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>{label}</th>
            <td className='govuk-table__cell'>{value}</td>
        </tr>
    );
};

renderRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};


const StageSummary = () => {
    const { summary, dispatch, page, apiStatus } = useContext(Context);
    const { primaryCorrespondent } = { ...summary };


    // update when updates are sent to the api
    useEffect(() => {
        if(apiStatus && apiStatus.status.display === 'Form received') {
            updateSummary(page.params.caseId, dispatch);
        }
    }, [apiStatus]);

    // load summary on mount
    useEffect(() => {
        updateSummary(page.params.caseId, dispatch);
    }, []);

    return (
        <Fragment>
            {summary &&
          <Fragment>
              <h2 className='govuk-heading-m'>Active stage{summary.stages.length > 1 && 's'}</h2>
              {summary.stages.map(stage => renderActiveStage(stage))}
              <h2 className='govuk-heading-m'>Case</h2>
              <table className='govuk-table margin-left--small'>
                  <caption className='govuk-table__caption margin-bottom--small' >Summary</caption>
                  <tbody className='govuk-table__body'>
                      {summary.case && summary.case.received && <tr className='govuk-table__row'>
                          <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Date received</th>
                          <td className='govuk-table__cell'>{summary.case.received}</td>
                      </tr>}
                      {summary.case && summary.case.created && <tr className='govuk-table__cell'>
                          <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Created</th>
                          <td className='govuk-table__cell'>{summary.case.created}</td>
                      </tr>}
                      {summary.deadlinesEnabled && summary.case && summary.case.deadline && <tr className='govuk-table__cell'>
                          <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Deadline</th>
                          <td className='govuk-table__cell'>{summary.case.deadline}</td>
                      </tr>}
                      {summary.primaryTopic && <tr className='govuk-table__cell'>
                          <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Primary topic</th>
                          <td className='govuk-table__cell'>{summary.primaryTopic}</td>
                      </tr>}
                      {primaryCorrespondent && <tr className='govuk-table__cell'>
                          <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Primary correspondent</th>
                          <td className='govuk-table__cell'>
                              <span>{primaryCorrespondent.fullname}</span>
                              {primaryCorrespondent.address && <>
                                  {primaryCorrespondent.address.address1 && <> <br /> <span>{primaryCorrespondent.address.address1}</span> </>}
                                  {primaryCorrespondent.address.address2 && <> <br /> <span>{primaryCorrespondent.address.address2}</span> </>}
                                  {primaryCorrespondent.address.address3 && <> <br /> <span>{primaryCorrespondent.address.address3}</span> </>}
                                  {primaryCorrespondent.address.postcode && <> <br /> <span>{primaryCorrespondent.address.postcode}</span> </>}
                                  {primaryCorrespondent.address.country && <> <br /> <span>{primaryCorrespondent.address.country}</span> </>}
                              </>}
                          </td>
                      </tr>}
                      {summary.additionalFields && summary.additionalFields.map(({ label, value }) => renderRow({ label, value }))}
                  </tbody>
              </table>
              {summary.deadlines && <table className='govuk-table margin-left--small'>
                  <caption className='govuk-table__caption margin-bottom--small' >Stage deadlines</caption>
                  <tbody className='govuk-table__body'>
                      {summary.deadlines && Array.isArray(summary.deadlines) && summary.deadlines.map(stage => renderRow(stage))}
                  </tbody>
              </table>}
          </Fragment>
            }
        </Fragment>
    );
};

export default StageSummary;
