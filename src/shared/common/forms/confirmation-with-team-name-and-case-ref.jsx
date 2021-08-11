import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConfirmationWithTeamNameAndCaseRef extends Component {

    getTeamName(teams, data){
        if (data.AcceptanceTeam){
            return teams.find(team => team.key === data.AcceptanceTeam).value;
        }
        return '';
    }

    render() {

        const {
            label,
            caseRef,
            choices,
            data
        } = this.props;

        const teamName = this.getTeamName(choices, data);

        return (
            <div>
                <div className="govuk-panel govuk-panel--confirmation">
                    <div className="govuk-panel__body">Case {label}: {teamName}
                    </div>
                </div>
                <h2 className="govuk-heading-m">
                    Case {caseRef} {label} {teamName}
                </h2>
            </div>
        );
    }
}

ConfirmationWithTeamNameAndCaseRef.propTypes = {
    data: PropTypes.object,
    label: PropTypes.string,
    caseRef: PropTypes.string,
    choices: PropTypes.array
};