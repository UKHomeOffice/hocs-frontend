import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class ConfirmationWithCaseRef extends Component {

    render() {

        const {
            label,
            caseRef,
            nextActions,
            teamName,
            name,
            callback
        } = this.props;

        return (
            <div>
                <div className="govuk-panel govuk-panel--confirmation">
                    <div className="govuk-panel__body">Case {label}: {teamName}
                    </div>
                </div>
                <h2 className="govuk-heading-m">
                    Case {caseRef} {label} {teamName}
                </h2>
                <div>
                    {nextActions &&
                        nextActions.map((action, i) => {
                            return (
                                <Fragment key={i}>
                                    <div className='govuk-table__cell'>
                                        <a href={`${action.url}`} onClick={() => callback( { submitAction: name } )} className="govuk-link govuk-heading-m">{action.label} </a>
                                    </div>
                                </Fragment>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

ConfirmationWithCaseRef.propTypes = {
    label: PropTypes.string,
    caseRef: PropTypes.string,
    nextActions: PropTypes.array,
    name: PropTypes.string,
    teamName: PropTypes.string,
    callback: PropTypes.func
};