import React, { useContext } from 'react';
import { formatDate } from '../../../../server/libs/dateHelpers';
import { Link } from 'react-router-dom';

import { Context } from '../../contexts/application.jsx';

const Suspensions = (props) => {
    const { page } = useContext(Context);
    const { SUSPENSION } = props.props;

    const currentSuspensionTypeList = SUSPENSION.filter(suspension => suspension.typeData.length > 0).map(sus => {
        return {
            label: sus.typeInfo.actionLabel,
            susOfType: [...sus.typeData]
        };
    });


    const getExistingSuspension = (suspensions) => {
        let existing = [];
        suspensions.forEach(sus => existing = [...existing, ...sus.susOfType]);
        existing = existing.filter(sus => !sus.dateSuspensionRemoved);
        return existing.length > 0 ? existing[0] : null;
    };

    const filteredPastSuspensions = (suspensions) => {
        let existing = [];
        suspensions.forEach(sus => existing = [...existing, ...sus.susOfType]);
        existing = existing.filter(sus => sus.dateSuspensionRemoved);
        return existing;
    };

    const existingSuspension = getExistingSuspension(currentSuspensionTypeList);
    const historicSuspensions = filteredPastSuspensions(currentSuspensionTypeList);

    return (
        <div className="tab__content">

            { existingSuspension &&
                <>
                    <h2 className="govuk-heading-s">Case Currently Suspended</h2>
                    <p className="govuk-body">Date current suspension applied: {formatDate(existingSuspension.dateSuspensionApplied)}.</p>
                    <Link
                        className='govuk-body govuk-link'
                        to={`/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/suspension/remove/${existingSuspension.uuid}?hideSidebar=true&activeTab=CASE_ACTIONS`}
                    >Remove the current suspension</Link>
                </>
            }
            { !existingSuspension &&
                <>
                    <h3 className="govuk-heading-s">Suspend Case</h3>
                    <Link
                        className='govuk-body govuk-link'
                        to={ `/case/${page.params.caseId}/stage/${page.params.stageId}/caseAction/suspension/add` }
                    >Suspend this case</Link>
                </>
            }

            { historicSuspensions.length > 0 &&
                <>
                    <h3 className="govuk-heading-s">Case Suspension History</h3>
                    <p className="govuk-body full-width">This case has previously been suspended {historicSuspensions.length} time{historicSuspensions.length > 1 ? 's': null}.</p>

                    { historicSuspensions.map((sus,i) =>
                        <p key={i} className="govuk-body"
                        >
                            From: {formatDate(sus.dateSuspensionApplied)}, until: {formatDate(sus.dateSuspensionRemoved) }
                        </p>
                    )}
                </>

            }
        </div>
    );
};

export default Suspensions;

