import React, { useState, useEffect, useContext } from 'react';
import { formatDate } from '../../../../server/libs/dateHelpers';
import {Link} from 'react-router-dom';

import { Context } from '../../contexts/application.jsx';

const Suspensions = (props) => {
    // const { SUSPENSIONS } = props;
    const { page } = useContext(Context);

    const SUSPENSIONS = [
        {
            uuid: 'uuid2',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: '2022-01-02',
        },{
            uuid: 'uuid',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: '2022-01-01',
        },
        {
            uuid: 'uuid',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: '2021-12-01',
            dateSuspensionRemoved: '2021-12-15'
        },
        {
            uuid: 'uuid',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: '2021-12-01',
            dateSuspensionRemoved: '2021-12-15'
        }
    ];
    const getExistingSuspension = (suspensions) => {
        const existing = suspensions.filter(sus => !sus.dateSuspensionRemoved);
        return existing.length > 0 ? existing[0] : null;
    };

    const filteredPastSuspensions = (suspensions) => {
        return suspensions.filter(sus => sus.dateSuspensionRemoved);
    };

    const existingSuspension = getExistingSuspension(SUSPENSIONS);

    return (
        <div className="tab__content">
            <h2 className="govuk-heading-s">Suspend Case</h2>
            { existingSuspension && <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/suspension/${existingSuspension.uuid}`}>Remove the current suspension</Link> }
            { !existingSuspension && <Link className='govuk-body govuk-link' to={ `/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/suspension/add` }>Suspend this case</Link> }

            { filteredPastSuspensions(SUSPENSIONS).length > 0 &&
                <>
                    <h3 className="govuk-heading-s">Case Suspension History</h3>
                    <p className="govuk-body full-width">This case has previously been suspended {filteredPastSuspensions(SUSPENSIONS).length} times.</p>
                    <ul>

                        { filteredPastSuspensions(SUSPENSIONS).map((sus,i) =>

                            <li key={i} className="govuk-body"
                            >
                                From: {formatDate(sus.dateSuspensionApplied)}, until: {formatDate(sus.dateSuspensionRemoved) }
                            </li>
                        )}
                    </ul>
                </>

            }
        </div>
    );
};

export default Suspensions;

