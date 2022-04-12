import React, { useState } from 'react';

const Suspensions = ({ props }) => {
    // const { SUSPENSIONS } = props;

    const SUSPENSIONS = [
        {
            uuid: 'uuid',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: new Date(),
        },
        {
            uuid: 'uuid',
            caseTypeActionUuid: 'another uuid',
            caseSubtype: 'SUSPEND',
            caseTypeActionLabel: 'Case Suspension',
            dateSuspensionApplied: new Date(),
            dateSuspensionRemoved: new Date()
        }
    ];
    const checkSuspended = (suspensions) => {
        return suspensions.filter(sus => !sus.dateSuspensionRemoved).length > 0;
    };

    const [isSuspended, setIsSuspended] = useState(checkSuspended(SUSPENSIONS));

    return (
        <>
            <h2 className="govuk-heading-s">Suspend Case</h2>

            { SUSPENSIONS.length > 0 && <h3>Case Suspension History</h3>}
            { SUSPENSIONS.length > 0 &&
                SUSPENSIONS.map((sus,i) =>
                    <p key={i}>Suspended on: {sus.dateSuspensionApplied}, suspension removed: {sus.dateSuspensionRemoved}</p>
                )
            }
        </>
    );
};

export default Suspensions;

